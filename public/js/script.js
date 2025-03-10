    // Socket.io();
    const socket=io();
    console.log(socket)
    console.log("first")

    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit("send-location",{latitude,longitude})
        },(error)=> {
            console.error(error)
        },{
            enableHighAccuracy:true,
            maximumAge:0,
            timeout:5000,
        })
    }


    // L.map("map") //alert for map

   const map= L.map("map").setView([0,0],16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:"hello world"
    }
).addTo(map)

const markers={};
socket.on("receive-location",(data)=>{
    console.log("Received location:", data);  // Debugging line

    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){

        map.removeLayer(markers[id]);
        delete markers[id];
    }
})

