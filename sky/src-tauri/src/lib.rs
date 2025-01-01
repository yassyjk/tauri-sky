// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;
// use argon2::{
//     password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
//     Argon2, Algorithm, Params, Version
// };

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// パスワードハッシュ化関数
// #[tauri::command]
// fn hash_password(password: &str) -> Result<Vec<u8>, String> {
//     let salt = SaltString::generate(&mut OsRng);
//     let argon2 = Argon2::new(Algorithm::Argon2d, Version::V0x13, Params::default());
//     argon2.hash_password(password.as_bytes(), &salt)
//     .map(|hash| hash.to_string().into_bytes())
//     .map_err(|e| e.to_string())
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let salt_path = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve local data path")
                .join("salt.txt");
            app.handle().plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
            Ok(())
        })
        // .plugin(tauri_plugin_stronghold::Builder::new(|pass| {
        //     // ハッシュ化処理
        //     // hash_password(pass).map_err(|e| format!("Failed hashing: {}", e))
        //     // let salt = SaltString::generate(&mut OsRng);
        //     // let argon2 = Argon2::default();
        //     match hash_password(pass){
        //         Ok(hash) => hash,
        //         Err(err) =>{
        //             eprintln!("Failed hashing: {}", err);
        //             return Vec::new();
        //         }
        //     // }
        //     //     Ok(hash) => {
        //     //         Ok(hash.to_string().into_bytes())
        //     //     },
        //     //     Err(err) =>{
        //     //         Err(format!("Failed hashing: {}", err))
        //     //     }
        //     }
        // }).build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())  // dialog用
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
