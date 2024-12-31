import React, { useState, useEffect } from 'react';
import "../../App.css";
import "./Register.css";
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
// import { appDataDir } from '@tauri-apps/api/path';
// import { invoke } from "@tauri-apps/api/core";


interface IPostFormProps {
    initStronghold: () => Promise<void>;
    getRegister: (client: Client) => Promise<void>;
    username: string;
    password: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    stronghold: Stronghold | null;
    client: any;
}

const Register: React.FunctionComponent<IPostFormProps> = ({ initStronghold, getRegister, username, password, setUsername, setPassword, stronghold, client }) => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [strongholdResult, setStrongholdResult] = useState<string | null>(null);
    const [registerResult, setRegisterResult] = useState<string | null>(null);
    // const [result, setResult] = useState<string | null>(null);
    // const [stronghold, setStronghold] = useState<Stronghold | null>(null);
    // const [client, setClient] = useState<any>(null);
    

    // const initStronghold = async () => {
    //     try {
    //         const vaultPath = `${await appDataDir()}/vault.hold`;
    //         const strongholdPassword = "tauri-sky";

    //         const newStronghold = await Stronghold.load(vaultPath, strongholdPassword);

    //         let strongholdClient: Client;

    //         const clientName = "main-client-name";
    //         try{
    //             strongholdClient = await newStronghold.loadClient(clientName);
    //         }catch{
    //             strongholdClient = await newStronghold.createClient(clientName);
    //         }

    //         await setStronghold(newStronghold);
    //         await setClient(strongholdClient);
    //         getRegister();
    //     } catch (error) {
    //         console.error("Stronghold error:" + error);
    //         setStrongholdResult("Stronghold 初期化エラー:" + error);
    //     }
    // }

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stronghold || !client) {
            setRegisterResult("strongholdが初期化されていません。")
            await initStronghold();
            return;
        }

        try {
            // const hashPassword = await invoke<string>("hash_password", { password });
            const encodedUsername = Array.from(new TextEncoder().encode(username));
            const encodedPassword = Array.from(new TextEncoder().encode(password));

            const store = client.getStore();
            
            await store.insert("username", encodedUsername);
            await store.insert("app-password", encodedPassword);
            await stronghold.save();
            getRegister(client);
            setRegisterResult("ユーザー登録しました。")
        } catch (error) {
            setRegisterResult(`登録エラー: ${error}`);
        }
    };

    // const getRegister = async () => {
    //     try {
    //         const store = client.getStore();
    //         const encodedUsername = await store?.get("username");
    //         console.log(encodedUsername);
    //         const encodedPassword = await store?.get("app-password");

    //         setUsername(new TextDecoder().decode(new Uint8Array(encodedUsername)));
    //         setPassword(new TextDecoder().decode(new Uint8Array(encodedPassword)));
            
    //         setResult("既存のユーザーを読み込みました。");
    //     }catch(error){
    //         setResult("ユーザー読み込みエラー" + error);
    //     }
    // }

    
    // const { stronghold, client } = initStronghold();

    // const store = client.getStore();

    useEffect(() => {
        initStronghold();
    }, []);
    
    
    return (
        <form onSubmit={handleRegister}>
            {/* {strongholdResult && 
                <p>{ strongholdResult }</p>
            } */}
            {registerResult && 
                <p>{ registerResult }</p>
            }
            {/* {result && 
                <p>{result}</p>
            } */}
            <div className="user-info">
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
            </div>
            <button type="submit">ユーザー登録</button>
        </form>
    );

};

export default Register;
