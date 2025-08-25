"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import  supabase  from "@repo/supabase";


export default function UserProfilePage({user}: {user?: any}) {
  const [name, setName] = useState(user?.name || "John Doe");
  const [imagechanged, setImagechanged] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState(user?.email || "johndoe@email.com");
  const [password, setPassword] = useState(user?.password || "");
  const [image, setImage] = useState<string >(user?.imageUrl||"https://cdn-icons-png.flaticon.com/512/149/149071.png");
  const [loading, setLoading] = useState(false);
  let newImage = "";

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // fallback image

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
if(imagechanged){
    const fileName = `${Date.now()}-${file?.name}-image`;
    const { data, error } = await supabase.storage
    .from("dp") // bucket name
    .upload(fileName, file as File);
    
if (error) {
console.error("Upload failed", error.message);


return;
}

// Get public URL
const { data: publicUrlData } = await supabase.storage
.from("dp")
.getPublicUrl(fileName);
console.log(publicUrlData.publicUrl);
 newImage = publicUrlData.publicUrl;

setImage(newImage);



}





    try {
      console.log("image:",image);
     const res = await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, image : newImage||image }),
      });
   
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col not-even: items-center h-screen max-sm:translate-x-[4.5%] max-sm:-translate-y-[0.5%] justify-center   bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-8  w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 max-sm:text-lg max-sm:mb-2 text-center">
          User Profile
        </h2>

        <div className="flex flex-col items-center space-y-4 max-sm:space-y-2">
          <img
            src={image || defaultImage}
            alt="User Avatar"
            className="w-32 h-32 max-sm:w-24 max-sm:h-24 rounded-full shadow-md object-cover"
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload"
            onChange={async (e) => {
                
                const newFile = e.target.files?.[0];
                if (!newFile) return;
              
                setFile(newFile);
                setImagechanged(true);
                setImage(URL.createObjectURL(newFile));
     
              
            }}
          />
          <label
            htmlFor="upload"
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white text-sm max-sm:text-xs rounded-lg shadow hover:bg-indigo-700"
          >
            Change Photo
          </label>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-sm:mt-1 space-y-5 max-sm:space-y-1">
          <div>
            <label className="block text-sm max-sm:text-xs font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm max-sm:text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm max-sm:text-xs font-medium text-gray-600 mb-1">
              Number
            </label>
            <input
              type="number"
              value={user?.number}
              readOnly
             
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm max-sm:text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white text-sm max-sm:text-xs rounded-xl shadow hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
