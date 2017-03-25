// 閲覧中のページのdocument.bodyはcontent_scriptでしか取得できない
var html2canvas = require('html2canvas')
var FileSaver = require('file-saver')

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  html2canvas(document.body).then(function(canvas) {
    var base64image = canvas.toDataURL("image/jpg")

    var block = base64image.split(";")
    var mimeType = block[0].split(":")[1] // In this case "image/jpg"
    var realData = block[1].split(",")[1] // For example:  iVBORw0KGgouqw23....

    var canvasBlob = b64toBlob(realData, mimeType)

    FileSaver.saveAs(canvasBlob, "screenshot.jpg")
  })
})

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  var byteCharacters = atob(b64Data)
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  var blob = new Blob(byteArrays, {
    type: contentType
  })
  return blob
}