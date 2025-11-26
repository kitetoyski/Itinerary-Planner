import { useEffect, useState } from "react";
import api from "../../api/api.helper";
import SplitText from "../../components/animation/splitText";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api.get("/test")
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage("Error connecting to backend"));
  }, []);
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  return (
    <>
        <SplitText
  text={message}
  className="text-2xl font-semibold text-center"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
/>
    </>
   
  );
}
