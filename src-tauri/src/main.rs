// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use tauri::command;

fn get_extended_path() -> String {
    let home = std::env::var("HOME").unwrap_or_default();
    let userprofile = std::env::var("USERPROFILE").unwrap_or_default();
    let appdata = std::env::var("APPDATA").unwrap_or_default();
    let localappdata = std::env::var("LOCALAPPDATA").unwrap_or_default();
    let path = std::env::var("PATH").unwrap_or_default();

    let additional_paths = vec![
        // Windows - npm global
        format!("{}\\AppData\\Roaming\\npm", userprofile),
        format!("{}\\npm", appdata),
        // Windows - Yarn
        format!("{}\\Yarn\\bin", localappdata),
        format!("{}\\AppData\\Local\\Yarn\\bin", userprofile),
        // Windows - nvm
        format!("{}\\AppData\\Roaming\\nvm", userprofile),
        // Windows - Programas
        "C:\\Program Files\\nodejs".to_string(),
        "C:\\Program Files (x86)\\nodejs".to_string(),
        // Unix-like paths (caso esteja usando WSL ou similar)
        format!("{}/npm/bin", home),
        format!("{}/.npm-global/bin", home),
        format!("{}/node_modules/.bin", home),
        format!("{}/.yarn/bin", home),
        format!("{}/.nvm/versions/node/*/bin", home),
        "/usr/local/bin".to_string(),
        "/usr/bin".to_string(),
        "/opt/homebrew/bin".to_string(),
    ];

    let mut paths: Vec<String> = if cfg!(windows) {
        path.split(';').map(|s| s.to_string()).collect()
    } else {
        path.split(':').map(|s| s.to_string()).collect()
    };

    paths.extend(additional_paths);
    
    if cfg!(windows) {
        paths.join(";")
    } else {
        paths.join(":")
    }
}

#[command]
fn execute_vtex_command(
    command: String,
    args: String,
    window: tauri::Window,
) -> Result<String, String> {
    let command_str = format!("vtex {} {}", command, args).trim().to_string();
    let extended_path = get_extended_path();

    let mut command = if std::env::consts::OS == "windows" {
        let mut cmd = Command::new("powershell");
        
        let ps_command = format!(
            "$ErrorActionPreference = 'Stop'; \
             $env:PATH = '{}'; \
             $vtexPath = Get-Command vtex -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source; \
             if ($vtexPath) {{ \
                & $vtexPath {} {} \
             }} else {{ \
                exit 1 \
             }}",
            extended_path.replace("\\", "\\\\"),
            command,
            args
        );
        
        cmd.arg("-WindowStyle")
           .arg("Hidden")
           .arg("-NoProfile")
           .arg("-NonInteractive")
           .arg("-Command")
           .arg(&ps_command);
        
        cmd.env("PATH", extended_path);
        cmd
    } else {
        let mut cmd = Command::new("sh");
        cmd.env("PATH", extended_path);
        cmd.args(["-c", &command_str]);
        cmd
    };

    let mut child = match command
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn() {
            Ok(child) => child,
            Err(e) => return Err(e.to_string()),
        };

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
