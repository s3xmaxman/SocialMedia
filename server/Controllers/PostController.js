import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";



//　新しいポストを作成
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//　ポストを取得する
export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//　ポストを更新する
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body; 

    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.updateOne({$set: req.body});
            res.status(200).json("Post Updated!!");
        } else {
            res.status(403).json({ message: "Access forbidden" });
        }  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

//　ポストを削除する
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const {userId} = req.body;

    try { 
        const post = await PostModel.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post Deleted!!");
        } else {
            res.status(403).json({ message: "Access forbidden" });
        } 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ポストにLikeかDislikeを付与する
export const likePost = async(req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post like!!");
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post Disliked!!");
        } 
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// タイムラインを取得する
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
    
    try {
        const currentUserPosts = await PostModel.find({ userId });
        const followWingsPosts = await UserModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).
        json(currentUserPosts.
        concat(...followWingsPosts[0].followingPosts).
        sort((a, b) => b.createdAt - a.createdAt));
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
