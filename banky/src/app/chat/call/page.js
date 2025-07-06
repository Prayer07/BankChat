'use client'
import { useEffect, useRef, useState } from "react";
import { initSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function CallPage() {
  const router = useRouter();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);
  const socketRef = useRef(null);
  const [calleePhone, setCalleePhone] = useState("");
  const [userId, setUserId] = useState("");
  const [stream, setStream] = useState(null);

  // Initialize camera and socket
  useEffect(() => {
    const init = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return router.push("/login");

      // Get current user
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserId(data.user._id);

      const sock = initSocket();
      socketRef.current = sock;
      sock.emit("join", { userId: data.user._id });

      sock.on("offer", async ({ from, offer }) => {
        console.log("📞 Incoming offer...");
        await initPeer();

        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);

        sock.emit("answer", { to: from, answer });
      });

      sock.on("answer", async ({ answer }) => {
        await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      sock.on("ice-candidate", async ({ candidate }) => {
        if (candidate) {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    };

    init();
  }, []);

  const initPeer = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(localStream);
    localVideoRef.current.srcObject = localStream;

    pc.current = new RTCPeerConnection();

    localStream.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream);
    });

    pc.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", {
          to: calleePhone, // We’ll use userId later
          candidate: e.candidate,
        });
      }
    };
  };

  const startCall = async () => {
    await initPeer();

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    socketRef.current.emit("offer", {
      to: calleePhone,
      from: userId,
      offer,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">📹 Video Call</h2>

      <input
        type="text"
        placeholder="Enter phone number to call"
        value={calleePhone}
        onChange={(e) => setCalleePhone(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button onClick={startCall} className="bg-blue-700 text-white px-4 py-2 rounded">
        Start Call
      </button>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <video ref={localVideoRef} autoPlay muted className="rounded border" />
        <video ref={remoteVideoRef} autoPlay className="rounded border" />
      </div>
    </div>
  );
}
