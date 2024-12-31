import React, { useEffect, useState } from 'react';
import { AtpAgent } from "@atproto/api";
import "../../App.css";


interface IMyPostlistProps {
    username: string;
    password: string;
}

const MyPostlist: React.FunctionComponent<IMyPostlistProps> = ({username, password}) => {
    // const [username, setUsername] = useState<string>("");
    // const [password, setPassword] = useState<string>("");
    const [postContent, setPostContent] = useState<any>(null);
    const [fetchResult, setFetchResult] = useState<string | null>(null);

    const agent = new AtpAgent({ service: "https://bsky.social" });

    const fetchMyPost = async () => {
        try {
            // ログイン処理
            console.log(username);
            console.log(password);

            await agent.login({ identifier: username + ".bsky.social", password });

            // 投稿一覧取得
            const response = await agent.getAuthorFeed({
                actor: `${username} + ".bsky.social"`,
                limit: 10
            })

            setPostContent(response);
            setFetchResult("投稿一覧を取得しました。");

        } catch (error) {
            setFetchResult("fetch error:" + error);
        }
    }

    useEffect(() => {
        fetchMyPost();
    }, [username]);

    // const getCredentials = () => {
    //     const localUsername = localStorage.getItem("username") as string;
    //     const localPassword = localStorage.getItem("app-password") as string;
    //     if (!username || !password) {
    //         setUsername(localUsername);
    //         setPassword(localPassword);
    //     }
    // }

    // const saveCredentials = (username: string, password: string) => {
    //     localStorage.setItem("username", username);
    //     localStorage.setItem("app-password", password);
    // }

    // const fetchMyPost = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const agent = new AtpAgent({ service: "https://bsky.social" });

    //     try {
    //         // ログイン処理
    //         const account = await agent.login({ identifier: username + ".bsky.social", password });

    //         // 投稿処理
    //         const response = await agent.post({
    //             text: postContent
    //         });

    //         setResult(`投稿に成功しました。:${account}:${JSON.stringify(response)}`);
    //         setPostContent("");
    //     } catch (error) {
    //         setResult(`投稿エラー: ${error}`);
    //     }
    // };
    
    return (
        <div>
            <h2>マイ投稿一覧</h2>
            {fetchResult && <p>{fetchResult}</p>}
            {postContent?.feed.map((post: any) => 
                <div>
                    <hr></hr>
                    <p>{post.record.text}</p>
                    <p>{post.record.createdAt}</p>
                </div>
            )}
        </div>
    );

};

export default MyPostlist;
