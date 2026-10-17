# Web Proxy

A local browser-based proxy for YouTube, YouTube Shorts, Poki, and other sites, powered by Scramjet.

## Run

Requires Node.js 20 or newer.

```sh
npm install
npm start
```

Open [http://127.0.0.1:3030](http://127.0.0.1:3030) in a browser. The server binds to loopback only, so it is available on this machine and is not an open proxy on your network. Set `PORT` to change the port.

Scramjet is experimental; some sites may block proxy playback, sign-in, or game input. Use the proxy only where you have permission, and follow the sites' terms of service.
Step 1: Open codespace in this repository
Step 2: Go to copilot and ask to install Node.js 20 or newer
Step 3: Run in the terminal: npm install npm start
