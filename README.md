<p align="center"> <img width="170px" height="160px" src="https://i.ibb.co/txm3d2q/nodesploit.png">
    </p>
 
# Nodesploit

Node Reverse Shell Control
NodeSploit, is a Trojan horse or remote access Trojan that allows the owner of the program to control the computer of the end user. It was made with NodeJS

## To Do

- [ ] Replace IP With hostname
- [ ] KeepAlive Sockets when server is down
- [ ] Store Sockets in Vuex
- [ ] On start check active socket
- [ ] Add information about Socket (Victime)
- [ ] Information About System

  - [ ] Linux:

    - [ ] **System** (uname -a)
    - [ ] **Memory** (free -m)
    - [ ] **CPU** (lscpu)
    - [ ] **Swap** (swapon -s)
    - [ ] **Distribution** (lsb_release -a)
    - [ ] **Disk & Partition** (fdisk -l)
    - [ ] **Port & Service** (netstat)
    
- [ ] Windows:
  
  - [ ] **System**  (systeminfo) /FO (FORMAT)
    - [ ] **Memory** 
    - [ ] **CPU**  (**wmic cpu get name**)
    - [ ] **Software**
    - [ ] **Network** (ipconfig -all)
    - [ ] **Mainboard baseboard** (wmic baseboard list brief)
    - [ ] **OS**  (wmic os get CSDVersion,Manufacturer,Name,OperatingSystemSKU,OSArchitecture,Version /value)
    - [ ] **BIOS**
    - [ ] **STARTUP Process** (wmic startup list brief)
    - [ ] **Disk**
- [ ] Add Process View
    - [ ] Process Lists (Linux:**top** | Windows:**tasklist**)
    - [ ] Kill Process
    - [ ] Start Process
- [ ] Add Webcam View
- [ ] Add Screen View
- [ ] Add Evil Section View
  - [ ] Reboot PC
  - [ ] Shutdown PC
  - [ ] Disable WIFI
  - [ ] Disable Sound
  - [ ] Disable Mouse
  - [ ] Disable Keyboard
  - [ ] Disable Webcam
- [ ] Advanced
    - [ ] Generate Exe for payload
    - [ ] Persistance
    - [ ] Auto Migrate Meterpreter
    - [ ] Exploit Finder
    - [ ] Add flags for victime (dnslookup)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# build web application for production
npm run build:web

#Pack for renderer 
npm run pack:renderer

#Pack for main
npm run pack:main

#Pack for main & renderer
npm run pack

```

---

<p align="center"> <img src="https://i.ibb.co/zHdKpsJ/salahbentayeb.png">
    </p>
