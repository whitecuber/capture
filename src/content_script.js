// 閲覧中のページのdocument.bodyはcontent_scriptでしか取得できない
import html2canvas from 'html2canvas'
import FileSaver from 'file-saver'

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.mode === 'capture') {
    html2canvas(document.body).then(function(canvas) {
      const base64image = canvas.toDataURL("image/jpg")
      const block = base64image.split(";")
      const mimeType = block[0].split(":")[1] // In this case "image/jpg"
      const realData = block[1].split(",")[1] // For example:  iVBORw0KGgouqw23....

      const canvasBlob = b64toBlob(realData, mimeType)

      FileSaver.saveAs(canvasBlob, "screenshot.jpg")
      sendResponse('captured')
    })
  }
})

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  let byteArrays = []

  for (const offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    let byteNumbers = new Array(slice.length)
    for (const i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, {
    type: contentType
  })
  return blob
}