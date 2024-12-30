import React, { useState } from 'react';
import { AtpAgent } from "@atproto/api";
import "../../App.css";
import "./PostForm.css";


interface IPostFormProps {
}

const PostForm: React.FunctionComponent<IPostFormProps> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [postContent, setPostContent] = useState("");
    const [result, setResult] = useState<string | null>(null);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();

        const agent = new AtpAgent({ service: "https://bsky.social" });

        try {
            // ログイン処理
            const account = await agent.login({ identifier: username + ".bsky.social", password });

            // 投稿処理
            const response = await agent.post({
                text: postContent
            });

            setResult(`投稿に成功しました。:${account}:${JSON.stringify(response)}`);
            setPostContent("");
        } catch (error) {
            setResult(`投稿エラー: ${error}`);
        }
    };
    
    return (
        <div>
            <h2>投稿フォーム</h2>
            {/* <div className="user-info">
                <label htmlFor="username">ユーザー名</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />.bsky.social
                <br></br>

                <label htmlFor="password">パスワード</label>
                <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                required />
            </div> */}
            <p>次に投稿内容を入力</p>
            {result &&
                <p>{result}</p>
            }
            <form onSubmit={handlePost} className="post-form">
                <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required>    
                </textarea>
                <br></br>
                <button type="submit">投稿</button>
            </form>
        </div>
    );

};

export default PostForm;
