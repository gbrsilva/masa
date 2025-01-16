// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use tauri::command;

fn get_extended_path() -> String {
    let home = std::env::var("HOME").unwrap_or_default();
    let path = std::env::var("PATH").unwrap_or_default();

    let additional_paths = vec![
        format!("{}/npm/bin", home),
        format!("{}/.npm-global/bin", home),
        format!("{}/node_modules/.bin", home),
        format!("{}/AppData/Roaming/npm", home),    // Windows
        format!("{}/AppData/Local/Yarn/bin", home), // Windows
        format!("{}/.yarn/bin", home),
        format!("{}/.nvm/versions/node/*/bin", home),
        "/usr/local/bin".to_string(),
        "/usr/bin".to_string(),
        "/opt/homebrew/bin".to_string(),
    ];

    let mut paths: Vec<String> = path.split(':').map(|s| s.to_string()).collect();

    paths.extend(additional_paths);
    paths.join(":")
}

#[command]
fn execute_vtex_command(
    command: String,
    args: String,
    window: tauri::Window,
) -> Result<String, String> {
    let command_str = format!("vtex {} {}", command, args).trim().to_string();
    let mut command = if cfg!(target_os = "windows") {
        let mut cmd = Command::new("cmd");
        cmd.args(["/C", &command_str]);
        cmd.env("PATH", get_extended_path().replace(":", ";"));
        cmd
    } else {
        let mut cmd = Command::new("sh");
        cmd.env("PATH", get_extended_path());
        cmd.args(["-c", &command_str]);
        cmd
    };

    let mut child = command
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    if let Some(stdout) = child.stdout.take() {
        let window_clone = window.clone();
        std::thread::spawn(move || {
            let reader = BufReader::new(stdout);
            reader.lines().for_each(|line| {
                if let Ok(line) = line {
                    let _ = window_clone.emit("terminal-output", line);
                }
            });
        });
    }

    if let Some(stderr) = child.stderr.take() {
        let window_clone = window.clone();
        std::thread::spawn(move || {
            let reader = BufReader::new(stderr);
            reader.lines().for_each(|line| {
                if let Ok(line) = line {
                    let _ = window_clone.emit("terminal-error", line);
                }
            });
        });
    }

    Ok("Comando iniciado".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![execute_vtex_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
