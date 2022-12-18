const fs = require('fs')
const {  huffmanNode} = require('../utilities/treeNode')
const {  binaryHuffmanTree} = require('../utilities/Tree')
const { log } = require('console')
const { encode, decode } = require('punycode')



//  function compressAndSave(root , filePath){
//     root = JSON.parse(root)
//     let file = [["id","name","posts(body,topic)","followers(id)"]]
//     for(let i=0 ; i<root.descendants.length ; i++){
//         let subFile = []
//         let userFieldsLength = root.descendants[i].descendants.length
//         for(let n=0 ; n<userFieldsLength ; n++){

//         let userField =root.descendants[i].descendants[n].name

//         if(userField ==="id") {
//             subFile.push(userField.value)
//         }

//         if(userField ==="name"){
//             subFile.push(root.descendants[i].descendants[n].value)
//         } 

//         if(userField ==="posts") {
//             let postArr =[]
//             let postsLength = root.descendants[i].descendants[n].descendants.length
//             for(let k=0 ; k< postsLength ; k++){
//                 let postBodyArr=[]
//                 let singlePostLength =root.descendants[i].descendants[n].descendants[k].descendants.length
//                 for(let h=0 ; h < singlePostLength; h++){
//                 let singlePostField =root.descendants[i].descendants[n].descendants[k].descendants[h]
//                 if(singlePostField.name === "body"){
//                     postBodyArr.push(root.descendants[i].descendants[n].descendants[k].descendants[h].value)
//                 }
//                 if(singlePostField.name === "topics"){
//                     let topncsPostSubArr = []
//                     let topicsLength =  root.descendants[i].descendants[n].descendants[k].descendants[h].descendants.length
//                     for(let j=0 ; j < topicsLength ; j++){
//                         let topic = root.descendants[i].descendants[n].descendants[k].descendants[h].descendants[j].value
//                         topncsPostSubArr.push(topic)
//                     }
//                     let wholePostArr = [postBodyArr , topncsPostSubArr]
//                     postArr.push(wholePostArr)
//                 }
//             }
//         }
//             subFile.push(postArr)
//         }

//         if(userField === "followers"){
//             let followersArr =[]
//             let followersLength =root.descendants[i].descendants[n].descendants.length
//             for(let k=0 ; k< followersLength; k++){
//                 let followerID = root.descendants[i].descendants[n].descendants[k].descendants[0].value
//                followersArr.push(followerID)
//             }
//             subFile.push(followersArr)
//         }

//     }
//     file.push(subFile)

//     }

//     content = JSON.stringify(file);
    
//     SaveFile(content ,filePath , 'compressed' )
//     return file
// }



// function decompressAndSave(file , filePath){
//     let lines= ['<users>']
//     for(let i=1 ; i< file.length ; i++ ){
//         lines.push('\t<user>')
//         // id value
//         let id = file[i][0]
//         lines.push(`\t\t<id>${id}</id>`)

    
//         // name value
//         let name = file[i][1]
//         lines.push(`\t\t<name>${name}</name>`)


//         lines.push('\t\t<posts>')
//         let postsLength = file[i][2].length
//         for(let k=0 ; k< postsLength  ; k++){
//             let postBody = file[i][2][k][0]
//             lines.push(`\t\t\t<post>`)
//             lines.push(`\t\t\t\t<body>`)
//             lines.push('\t\t\t\t\t'+postBody)
//             lines.push(`\t\t\t\t</body>`)

//             let topicsLength = file[i][2][k][1].length
//             lines.push(`\t\t\t\t<topics>`)
//             for(let j=0 ; j<topicsLength ; j++){
//                 lines.push(`\t\t\t\t\t<topic>`)
//                 let topic = file[i][2][k][1][j]
//                 lines.push('\t\t\t\t\t\t'+topic)
//                 lines.push(`\t\t\t\t\t</topic>`)
//             }
//             lines.push(`\t\t\t\t</topics>`)
//             lines.push(`\t\t\t</post>`)
//         }
//         lines.push('\t\t</posts>')

//         lines.push(`\t\t<followers>`)
//         let followersLength = file[i][3].length
//         for(let h=0 ; h<followersLength ; h++){
//             let followerID = file[i][3][h]
//             lines.push(`\t\t\t<follower>`)
//             lines.push(`\t\t\t\t<id>${followerID}</id>`)
//             lines.push(`\t\t\t</follower>`)

//         }
//         lines.push(`\t\t</followers>`)

//         lines.push(`\t</user>`)
        

//     }
//     lines.push(`</users>`)

//     SaveFile(lines, filePath , 'Decompressed')
//     return lines
// }

function compressAndSaveLZW(file){
    let dictionary = generateDic()
    let result = []
    let ASCII = Object.keys(dictionary).length - 1
    let i=0
    let lastChecked
    let string = ''
    let letter
    let test = [...file]
    while( i !== test.length){
        letter = test[i]
        string += letter
        if(dictionary[string] !== undefined ){
            lastChecked = string
        }else{
            ASCII++
            dictionary[string] = ASCII
            string =''
            result.push(dictionary[lastChecked])
            i--
        }
        i++
    }
    result.push(dictionary[lastChecked])

    return result
}
// console.log(compressAndSaveLZW('geekific'));
function decompressAndSaveLZW(file){
    let dictionary = generateDic()
    let result = []
    let ASCII = Object.keys(dictionary).length - 1

    let i=0
    let lastChecked
    let string = ''
    let letter
    while( i !== file.length){
        test =  file[i]
        letter = getDicKey(dictionary,file[i])
        if(letter === undefined){
            letter =  string[0]
        }
        string += letter
        if(dictionary[string] !== undefined ){
            lastChecked = string
        }else{
            ASCII++
            dictionary[string] = ASCII
            string =''
            result.push(lastChecked)
            i--
        }
        i++
    }
    result.push(lastChecked)

    return result.join('')
}
function getDicKey(dictionary , ASCII){
    return Object.keys(dictionary).find(key => dictionary[key] === ASCII)
}

function generateDic(){
    let dictionary = {}
    for( let ASCII = 0;ASCII<256 ; ASCII++){
        dictionary[String.fromCharCode(ASCII)] = ASCII
    }
    return dictionary
}

//console.log(decompressAndSaveLZW(compressAndSaveLZW('geekificAllTheWay for me tooooo')));


function convert2Binary(file){
    let binaryFile = ''
    for(let i=0 ; i< file.length ;i++){
        binaryFile += Number(file.charCodeAt(i)).toString(2).padStart(8,'0') 

    }
    return binaryFile
}

function getFreqTable(xmlFileMin){
    let freqTable= {}
    if(xmlFileMin.length ===1) xmlFileMin = xmlFileMin[0]

    for(let i=0 ; i< xmlFileMin.length ;i++){

            letter = xmlFileMin[i]
        
        if(freqTable[letter] === undefined){
            freqTable[letter] = 1
        }else{
            freqTable[letter]++

        }
    }
    return freqTable
}

function getNodeArr(freqTable){
    let result =[]
    for(const key in freqTable){
        let temp = new huffmanNode(key)
        temp.freq = freqTable[key]
        result.push(temp)
    }
    result.sort((a,b)=>{
        if(a.freq < b.freq) return -1
        else return 1
    })
    return result
}


function getKey(value , table){
    for(const key in table){
        if(table[key] == value )return key
    }
    return -1

}

function insertSort(objArr,node){
    let i=0 ,findSortedPlace=0
    while(i<objArr.length){
        if(node.freq < objArr[i].freq){
            findSortedPlace=1
            break
        }
        i++
    }
    if(findSortedPlace){
        return objArr.length
    }
    return i
}

function constructHuffmanTree(xmlFileMin){
    if(xmlFileMin.length ===1) xmlFileMin = xmlFileMin[0]
    let nodeArr = getNodeArr(getFreqTable(xmlFileMin))
    while(nodeArr.length !== 1){
        let temp = new huffmanNode('')
        temp.freq = nodeArr[0].freq + nodeArr[1].freq
        temp.descendants = [nodeArr[0],nodeArr[1]]
        nodeArr.shift()
        nodeArr.shift()
        let index = insertSort(nodeArr,temp);
        if(index ===0 ){
            nodeArr[0] = temp
        }else{
            nodeArr.splice(index,0,temp)
        }
    }
    let huffmanTree = new binaryHuffmanTree(nodeArr[0])
    return huffmanTree
}

function getFinalTable(huffmanTree){
   
      huffmanTree.getCodes(huffmanTree.root)
      return huffmanTree.codeTable
}
// let node1 = new huffmanNode('')
// let node2 = new huffmanNode('')
// let node3 = new huffmanNode('')
// let node9 = new huffmanNode('')
// let node4 = new huffmanNode('a')
// let node5 = new huffmanNode('b')
// let node6 = new huffmanNode('c')
// let node7 = new huffmanNode('d')
// let node8 = new huffmanNode('e')

// node1.descendants = [node2,node3]
// node2.descendants = [node4,node9]
// node3.descendants = [node7,node8]
// node9.descendants = [node5,node6]

// //console.log(node1);
// let testTree = new binaryHuffmanTree(node1)
// console.log(getFinalTable(testTree));
// let nodei1 = new huffmanNode('')
// let nodei2 = new huffmanNode('')
// let nodei3 = new huffmanNode('')
// let nodei9 = new huffmanNode('')
// let nodei4 = new huffmanNode('f')
// let nodei5 = new huffmanNode('g')
// let nodei6 = new huffmanNode('h')
// let nodei7 = new huffmanNode('j')
// let nodei8 = new huffmanNode('k')

// nodei1.descendants = [nodei2,nodei3]
// nodei2.descendants = [nodei4,nodei9]
// nodei3.descendants = [nodei7,nodei8]
// nodei9.descendants = [nodei5,nodei6]
// testTree = new binaryHuffmanTree(nodei1)

// console.log(getFinalTable(testTree));


// console.log(binaryHuffmanTree.codeTable);


// takes the string that comes off the minify function
function encodeH(xmlFileMin,referenceTable){
    let encodedFile=''
    for(let i=0;i<xmlFileMin.length;i++){
        encodedFile += referenceTable[xmlFileMin[i]]
    }
    return encodedFile
}

function binary2Decimal(binary){
    let decimal = 0;
    let counter =0;
    for(let i=binary.length - 1 ; i>=0 ;i--){
        decimal += Number(binary[i])* Math.pow(2,counter)
        counter++
    }
    return decimal.tostring()
}
function binary2Hex(binary){

    while(binary.length %4 !==0){
        binary = '0' + binary;
    }
    let hex ='';
    let counter =0
    let fourbits =''
    for(let i = 0; i<binary.length; i++ ){
         fourbits += binary[i]
         counter++;
         if(fourbits.length === 4){
            fourbits = parseInt(fourbits,2)
            fourbits = fourbits.toString(16)
            hex += fourbits
            counter=0
            fourbits=''
         }

    }
    return hex
}


function huffManCompress(xmlFileMin){

    if(xmlFileMin.length ===1) xmlFileMin = xmlFileMin[0]

    let huffmanTree = constructHuffmanTree(xmlFileMin)
    getFinalTable(huffmanTree)
    let referenceTable = huffmanTree.codeTable
    let encodedFile = encodeH(xmlFileMin,referenceTable)
    encodedFile = binary2Hex(encodedFile)
    encodedFile = encodedFile + '\n' + JSON.stringify(referenceTable)
    return encodedFile
}





function getDecodeTable(encodeTable){
    let decodeTable = {}
    for(const key in encodeTable){
        decodeTable[encodeTable[key]] = key
    }
    return decodeTable
}
function decodeH(encoding,referenceTable){
    let decodedFile =''
    let code =''
    for(let i=0 ; i<encoding.length ;i++){
        code += encoding[i]
        if(referenceTable[code] !== undefined){
            decodedFile += referenceTable[code]
            code =''
        }
    }
    return decodedFile
}

function hex2Binary(hex){
    let binary =''
    for(let i=0 ; i<hex.length ;i++){
        if(i!==0){
            binary += parseInt(hex[i],16).toString(2).padStart(4,'0')
        }else{
            binary += parseInt(hex[i],16).toString(2)
        }
    }
    let counter=0;
    while(binary[counter] =='0'){
        counter++
    }
    
    return binary.substring(counter);
}
// let test = "1000101010100111010101101100111001010001010101001110101011011001010001101100111110010111000100010011110110011111001010001010111000001100101011001011100111101001100101010111110111111001011101011010001001110101110000011001010110010100010100011000100111010010011100101000101000110001001110100100101000100100110000111100001100101110111100001101101010110010111101100100010011010100110010111011111100001110110000110110111100111011010100101111000001100101011010000010101110100111000010111001110101010011010010101101000101001101101111000001111101100100010110100110100110110010110000010111101010111010110101000001010111100111010101111101110111111000101111010110110010101001101100110000111110111101001010101100010001100001101101111011001011010011011001111101100111101010010111010010111010101010010111011101000000100110000110110101101111010110100101110111111000011101100001101101011011101100100000000001011100001011110000011101011000101010101000011111010111111100101001011110101010111011001100101111000001111101110110010110010111011001100101111111011010101011101101000001100000101011100101010101011010011101110101111000100111010001101010100111110111101011111111010101101010011011010100100001010010110110000101110111010100111001110100000110001001110001011101110100000010011000011011011010011101110101110110100111011010111010101010010111100000111010110001010101010110010001011110101111111101111010110000101110100111000011000110011000011111100010111010011100001011100111010100101010101000010100111110100010011100100110000111100001100101000110100110000100010110010011001110010100011010011000010001011001001100101010101001110000101111000011000000110001001111010011000010001011001001100101000110100110000100010110010011001000110101100101110000010110100110101100010011110100110000100010110010011001010001001111010011000010001011001001100111001010001001110100011000100111010010010100010100011000100111010010010100010010011000011110000110010111011110000110110101011001011110110010001001101010011001011101111110000111011000011011011110011101101010010111100000110010101101000001010111010011100001011100111010101001101001010110100010100110110111100000111110110010001011010011010011011001011000001011110101011101011010100000101011110011101010111110111011111100010111101011011001010100110110011000011111011110100101010110001000110000110110111101100101101001101100111110110011110101001011101001011101010101001011101110100000010011000011011010110111101011010010111011111100001110110000110110101101110110010000000000101110000101111000001110101100010101010100001111101011111110010100101111010101011101100110010111100000111110111011001011001011101100110010111111101101010101110110100000110000010101110010101010101101001110111010111100010011101000110101010011111011110101111111101010110101001101101010010000101001011011000010111011101010011100111010000011000100111000101110111010000001001100001101101101001110111010111011010011101101011101010101001011110000011101011000101010101011001000101111010111111110111101011000010111010011100001100011001100001111110001011101001110000101110011101010010101010100001010011111010001001110010011000011110000110010100011010011000010001011001001100111001010001101001100001000101100100110010100111100001110100000110111001010101010111010101101000000000110001001111010011000010001011001001100101000100111101001100001000101100100110011100101000100111010001100010011101001001010001001110100011000100111010010011100101000100110110000111001110110000001110101011011001110010100010011011000011100111011000000111010101101100101000110110011111001011011010001001111011001111100101000100111001101100001110011101100000011101010110110010100010011011000011100111011000000111010101101100101000110110011111001011011110001001111011001111100101000100111001101100001110011101100000011101010110110010100010011100110110000111001110110000001110101011011001110010100010011101010100111010101101100101000101010100111010101101100101000110110011111001011011010001001111011001111100101000101011100000110010101100101100111000010011100111010101101101111110011110100110010101011111000100111010111000001100101011001010001010001100010011101001001110010100010100011000100111010010010100010010011000011110000110010111011110000110110101011001011110110010001001101010011001011101111110000111011000011011011110011101101010010111100000110010101101000001010111010011100001011100111010101001101001010110100010100110110111100000111110110010001011010011010011011001011000001011110101011101011010100000101011110011101010111110111011111100010111101011011001010100110110011000011111011110100101010110001000110000110110111101100101101001101100111110110011110101001011101001011101010101001011101110100000010011000011011010110111101011010010111011111100001110110000110110101101110110010000000000101110000101111000001110101100010101010100001111101011111110010100101111010101011101100110010111100000111110111011001011001011101100110010111111101101010101110110100000110000010101110010101010101101001110111010111100010011101000110101010011111011110101111111101010110101001101101010010000101001011011000010111011101010011100111010000011000100111000101110111010000001001100001101101101001110111010111011010011101101011101010101001011110000011101011000101010101011001000101111010111111110111101011000010111010011100001100011001100001111110001011101001110000101110011101010010101010100001010011111010001001110010011000011110000110010100011010011000010001011001001100111001010001101001100001000101100100110010101010111101010010011000010100101101100001011100010011110100110000100010110010011001010001001111010011000010001011001001100111001010001001110100011000100111010010010100010011101000110001001110100100111001010001001101100001110011101100000011101010110110011100101000100110110000111001110110000001110101011011001010001101100111110010111000100010011110110011111001010001001110011011000011100111011000000111010101101100101000100111001101100001110011101100000011101010110110011100101000100111010101001110101011011001010001010101001110101011011001010001101100111110010110111100010011110110011111001010001010111000001100101011001011010011000111010100000110010101011111011111010111101010101011011011000110100010011101011100000110010101100101000101000110001001110100100111001010001010001100010011101001001010001001001100001111000011001011101111000011011010101100101111011001000100110101001100101110111111000011101100001101101111001110110101001011110000011001010110100000101011101001110000101110011101010100110100101011010001010011011011110000011111011001000101101001101001101100101100000101111010101110101101010000010101111001110101011111011101111110001011110101101100101010011011001100001111101111010010101011000100011000011011011110110010110100110110011111011001111010100101110100101110101010100101110111010000001001100001101101011011110101101001011101111110000111011000011011010110111011001000000000010111000010111100000111010110001010101010000111110101111111001010010111101010101110110011001011110000011111011101100101100101110110011001011111110110101010111011010000011000001010111001010101010110100111011101011110001001110100011010101001111101111010111111110101011010100110110101001000010100101101100001011101110101001110011101000001100010011100010111011101000000100110000110110110100111011101011101101001110110101110101010100101111000001110101100010101010101100100010111101011111111011110101100001011101001110000110001100110000111111000101110100111000010111001110101001010101010000101001111101000100111001001100001111000011001010001101001100001000101100100110011100101000110100110000100010110010011001010011010001100001101101001001110001001111010011000010001011001001100101000100111101001100001000101100100110011100101000100111010001100010011101001001010001001110100011000100111010010011100101000100110110000111001110110000001110101011011001110010100010011011000011100111011000000111010101101100101000110110011111001011100010001001111011001111100101000100111001101100001110011101100000011101010110110010100010011100110110000111001110110000001110101011011001110010100010011101010100111010101101100101000100111010101001110101011011001110010"
// let test2 = "1010101111000"
// console.log(test2.substring(3));
// console.log(test.length % 4);

// if(test.length % 4 !==0){
//     let overhead = '0'.repeat(test.length % 4)
//     test = overhead + test;
// }
// console.log(test.length % 4);
// let hex = binary2Hex(test)
// let bin = hex2Binary(hex)
// console.log(bin.length %4);
//console.log(hex);

// console.log(test == bin);
// let test = 'A'
// let dec = parseInt(test,16)
// let bin = dec.toString(2)
// console.log(bin);

// takes the string that comes off the huffman compress function
function huffManDecompress(compressedXmlFile){
    compressedXmlFile = compressedXmlFile.split("\n")
    let encoding = hex2Binary(compressedXmlFile[0])
    let referenceTable = getDecodeTable(JSON.parse(compressedXmlFile[1]))
    let decodedFile =decodeH(encoding,referenceTable)

    return decodedFile
}






module.exports = {
    huffManCompress:huffManCompress,
    huffManDecompress:huffManDecompress
}


    