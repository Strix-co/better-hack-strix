import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="font-sans text-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-white space-y-10">
      <div className="space-y-5">
        <h1 className="md:text-[150px] sm:text-3xl text-xl">PitchSwipe</h1>
        <p className="md:text-[40px] sm:text-xl">Where investors meet <br /> startups, one swipe at a time.</p>
      </div>

      <div className="btns flex gap-3 items-center text-gray-800">
        <Link href={"/signin/startup"}><button className="cursor-pointer hover:bg-white transition-opacity bg-gray-200/20 text-white backdrop-blur-2xl p-3 rounded-md">Register as startup</button></Link>
        <Link href={"/signin/investor"}><button className="cursor-pointer hover:bg-white transition-opacity bg-gray-200/20 text-white backdrop-blur-2xl p-3 rounded-md">Register as investor</button></Link>
      </div>
    </div>
    </>
  );
}
