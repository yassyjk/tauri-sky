import React, { useState, useEffect } from 'react';
import "../../App.css";
import "./Register.css";
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir } from '@tauri-apps/api/path';
// import { invoke } from "@tauri-apps/api/core";

// import * as argon2 from "argon2"; 


interface IPostFormProps {
}

const Register: React.FunctionComponent<IPostFormProps> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [stronghold, setStronghold] = useState<Stronghold | null>(null);
    const [client, setClient] = useState<any>(null);
    

    const initStronghold = async () => {
        try {
            console.log("0");
            const vaultPath = `${await appDataDir()}/vault.hold`;
            const strongholdPassword = "tauri-sky";
            console.log("1");
            console.log(vaultPath);
            console.log(strongholdPassword);
            const newStronghold = await Stronghold.load(vaultPath, strongholdPassword);
            console.log("2");

            let client: Client;

            const clientName = "main-client";
            try{
                client = await newStronghold.loadClient(clientName);
            }catch{
                client = await newStronghold.createClient(clientName);
            }

            // return {
            //     stronghold,
            //     client,
            // };
            setStronghold(newStronghold);
            setClient(client);
            console.log("3" + client);
            // await getRegister();
        } catch (error) {
            console.log(error);
            console.log("99");
            console.error("Stronghold error:" + error);
            setResult("Stronghold 初期化エラー:" + error);

            // try {
            //     const vaultPath = `${await appDataDir()}vault.stronghold`;
            //     const strongholdPassword = "tauri-sky";
            //     const newStronghold = await Stronghold.create(vaultPath, strongholdPassword);
            //     const newClient = await newStronghold.loadClent("main-client");
            //     setStronghold(newStronghold);
            //     setClient(newClient);
            //     setResult("Sgrongholdを新規作成");
            // } catch (createerror) {
            //     console.error("Error create Stronghold:" , createerror);
            //     setResult("Strongholdの作成中にエラー:" + createerror);
            // }
        }
    }

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("5");
        console.log(stronghold);
        console.log(client);

        if (!stronghold || !client) {
            setResult("strongholdが初期化されていません。")
            await initStronghold();
            return;
        }

        try {
            // const hashPassword = await invoke<string>("hash_password", { password });
            const encodedUsername = Array.from(new TextEncoder().encode(username));
            const encodedPassword = Array.from(new TextEncoder().encode(password));
            const store = client.getStore();
            console.log("6");
            
            await store.insert("username", encodedUsername);
            await store.insert("password", encodedPassword);
            await stronghold.save();
            getRegister();
            setResult("ユーザー登録しました。")
        } catch (error) {
            setResult(`登録エラー: ${error}`);
        }
    };

    const getRegister = async () => {
        try {
            console.log("4");
            const store = client.getStore();
            const encodedUsername = await store.get("username");
            console.log(encodedUsername);
            const encodedPassword = await store.get("password");

            // if (!client) {
            //     setResult("clientが初期化されていません。");
            //     return;
            // }

            // try{
            //     const store = client.getStore();
            //     const encodedUsername = await store.get("username");
            //     const encodedPassword = await store.get("password");
            //     if(encodedUsername && encodedPassword){
            //         setUsername(
            //             new TextDecoder().decode(new Uint8Array(encodedUsername))
            //         );
            //         setPassword(
            //             new TextDecoder().decode(new Uint8Array(encodedPassword))
            //         );
            setUsername(new TextDecoder().decode(new Uint8Array(encodedUsername)));
            setPassword(new TextDecoder().decode(new Uint8Array(encodedPassword)));
            
            setResult("既存のユーザーを読み込みました。");
        }catch(error){
            setResult("ユーザー読み込みエラー" + error);
        }
    }

    
    // const { stronghold, client } = initStronghold();

    // const store = client.getStore();
    useEffect(()=>{
        initStronghold();
    }, [])
    
    useEffect(() => {
        getRegister();
    }, [stronghold]);
    

    
    return (
        <form onSubmit={handleRegister}>
            {result && 
                <p>{result}</p>
            }
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
