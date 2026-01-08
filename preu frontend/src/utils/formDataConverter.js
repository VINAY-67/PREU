export const formDataConverter=(obj)=>{
    let fd=new FormData()
    fd.append("title",obj.title)
    fd.append("prompt",obj.prompt)
    fd.append("author",obj.author)
    fd.append("rating",obj.rating)
    fd.append("bookmarks",obj.bookmarks)
    fd.append("tags",obj.tags)
    fd.append("image",obj.imageUrl)

    return fd
}