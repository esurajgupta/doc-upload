export const parserXML = (xml) => {

    const parser = new DOMParser();
    const result = parser.parseFromString(xml, "text/xml");
    return result.getElementsByTagName("ticket")[0].childNodes[0].nodeValue;
}

export const sortTaskRelatedDocs = (documents, documentId) => {
    console.log(documents, documentId, "sorttaskrelatedDocs");
    let sortedDocs = [];
    documents.forEach((doc) => {
        if (documentId === doc?.entry?.id) {
            sortedDocs.push(doc);
        }
    });
    console.log(sortedDocs);

    return sortedDocs;
};

export const findUserFolderId = (folders) => {

    const result = folders.find((item) => item.entry.name === "User Homes");
    if (result) {
        return result.entry.id;
    } else {
        return null;
    }
};

export const findUserId = (folders, userName) => {
    console.log(folders, userName, "finduserId");

    const result = folders.find((item) => item.entry.name === userName);
    if (result) {
        return result?.entry?.id;
    } else {
        return null;
    }
};