const {ipcRenderer} = require('electron');

document.querySelector('.xml-btn').addEventListener('click', () => {
    ipcRenderer.send('command', 'gotoXMLAnalyzer');
})

    document.addEventListener('DOMContentLoaded' , ()=>{
        const xml = localStorage.getItem("textFieldValue");
        localStorage.clear();
        console.log(xml);
        const s = new sigma({
            renderer: {
              container: 'graph-container',
              type: 'canvas'
            },
            settings: {
              defaultNodeColor: '#333',
              maxNodeSize: 20,
              minArrowSize:15,
              edgeColor: 'default',
              defaultEdgeColor: '#ccc'
            }
          });
              ipcRenderer.send('command' , 'visualize' ,xml)
        ipcRenderer.on('visualizeReponse' , (event , data)=>{
            data = JSON.parse(data);
              s.graph.read(data)
              s.refresh()
        })
    })
