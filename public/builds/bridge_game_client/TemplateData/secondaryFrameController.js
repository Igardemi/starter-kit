let message = ""
window.addEventListener('message', (event) => {
    // console.log(event.data);

    // Verificar si el mensaje recibido tiene una propiedad 'action'
    if (!event.data || typeof event.data.action === 'undefined') 
        return;

    if (event.data.action == 'MessageToSecondaryFrame') 
        this.myUnityInstance.SendMessage('FrameController', 'FrameMessageReceived', event.data.message);

        return;
    
    if (event.data.action == 'SetLoadProgress') 
        this.myUnityInstance.SendMessage('FrameController', 'SetLoadProgress', event.data.progress);
});

