import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    desc: String,
    img: String,
    likes: [],
    comments: [
        {
            userId: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
},
    { timestamps: true } // เพิ่ม timestamps เพื่อเก็บข้อมูลเวลาที่สร้างและอัปเดตโพสต์
);

var PostModel = mongoose.model("Post", postSchema);

export default PostModel; // Export the model เพื่อให้สามารถนำไปใช้ในส่วนอื่นของโปรแกรมได้