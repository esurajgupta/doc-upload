export const parserXML = (xml) => {

    const parser = new DOMParser();
    const result = parser.parseFromString(xml, "text/xml");
    return result.getElementsByTagName("ticket")[0].childNodes[0].nodeValue;
}