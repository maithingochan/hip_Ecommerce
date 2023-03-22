# quản lý code git init
- git init
- git remote add origin https://github.com/maithingochan/hip_Ecommerce.git
- lưu git add . (chuẩn bị các file để lưu vào local)
-  git commit -m 'setting' (đưa vào git local)
- git push -u  origin master(lần đầu đẩy lên )
# Getting Started with Create React App

- git status [Thay đổi bao nhiêu file ]
- git remote -v [Lấy link url trên github]
- git remote add origin https://github.com/maithingochan/trello.git
- git remote -v

## Đẩy code lên git
- git add.
- git commit -m "Init Project." 
- git push origin master
## Đây code lên branch
- git branch
- git checkout -b update_readme
- git status
- git add .
- git commit -m "Update reame"
- git push origin update_readme

## Thay đổi code trong branch
- git add .
- git commit --amend
- :wq
- git push origin update_readme -f
## 
- git checkout master
- git push origin master
## xoa branch
- git branch -D update_readme
# gox nhanh mongodb
- !mdbgum

# req
- Biến `req` là một đối tượng (object) trong JavaScript, đại diện cho request (yêu cầu) được gửi từ client (phía front-end) lên server (phía back-end). Đối tượng `req` cung cấp các thông tin về HTTP request như HTTP method (GET, POST, PUT, DELETE, PATCH, OPTIONS...), URL của request, HTTP headers của request, các tham số (parameters) được gửi kèm với request (ví dụ như thông tin đăng nhập, dữ liệu của form, file upload...) và nhiều thông tin khác liên quan đến HTTP request.


Một số thuộc tính thông dụng của đối tượng `req` trong ứng dụng web Node.js bao gồm:


- `req.method`: HTTP method của request.
- `req.url`: URL của request.
- `req.headers`: HTTP headers của request, bao gồm một đối tượng (object) với các thuộc tính là các headers của request.
- `req.params`: Chứa các giá trị của các tham số trong URL của request, ví dụ như `www.example.com/user/:userId` thì `req.params.userId` sẽ chứa giá trị của `userId`.
- `req.query`: Chứa các giá trị của các tham số được gửi theo URL query string của request, ví dụ như `www.example.com/search?q=apple` thì `req.query.q` sẽ chứa giá trị `"apple"`.
- `req.body`: Chứa dữ liệu của request được gửi kèm theo trong phần thân (body) của request, thường được sử dụng trong các request POST hoặc PUT.
- `req.cookies`: Chứa các cookie được gửi kèm với request.


Thông tin trong đối tượng `req` được truy xuất và sử dụng trong các middleware và handler function trong các ứng dụng Node.js.



## Biến `req.headers` là một thuộc tính của đối tượng `req` trong Node.js, đại diện cho HTTP headers của request gửi từ client lên server.


HTTP headers là các thông tin meta chứa trong phần đầu tiên (header) của một message HTTP request hoặc response. Headers giúp các client và server biết thông tin về request hoặc response như thời gian, địa điểm và cách mã hóa văn bản, nội dung, định dạng, độ dài của message...


Đối tượng `req.headers` sẽ chứa các headers của HTTP request, dưới dạng một đối tượng (object) trong Node.js, trong đó, tên của các headers được chuyển đổi thành các thuộc tính của đối tượng, và giá trị của các headers được gán cho giá trị của các thuộc tính đó.


Ví dụ, nếu request có header "`Content-Type: application/json`", thì giá trị của `req.headers["content-type"]` sẽ là `"application/json"`. Một số headers thông dụng trong HTTP requests bao gồm:


- `User-Agent`: giúp server biết thông tin về loại trình duyệt hay ứng dụng được sử dụng để gửi yêu cầu tới server.
- `Accept`: giúp server biết kiểu nội dung (content type) mà client mong muốn nhận lại.
- `Content-Type`: thường được sử dụng để xác định kiểu dữ liệu của phần body của request.
- `Authorization`: chứa thông tin xác thực (authentication) của người dùng được gửi kèm theo trong request.
- `Cookie`: Chứa danh sách các cookie được gửi kèm theo trong request.
và nhiều headers khác liên quan đến HTTP request và cách hoạt động của phần body của request.

# res
Trong JavaScript, biến `res` thường được sử dụng trong các hàm callback của các framework hoặc thư viện phía server như Node.js, Express.js, hoặc các thư viện HTTP request như `axios`.


`res` là một tham số đầu vào của hàm callback và được sử dụng để trả về kết quả từ server đến client. Khi ta gửi một yêu cầu (request) từ client đến server, server xử lý nó và trả về một kết quả (response) thông qua biến `res`.


`res` có thể được sử dụng để trả về các thông tin hoặc dữ liệu từ server về client, như là một phản hồi (response) cho yêu cầu mà client đã gửi. Ví dụ:


`res.send()`: được sử dụng để trả về một chuỗi (string) như là nội dung HTML hoặc JSON của response.
`res.json()`: được sử dụng để trả về dữ liệu dưới dạng JSON.
`res.render()`: được sử dụng để trả về một trang HTML được render từ các file view(s).
`res.redirect()`: được sử dụng để chuyển hướng đến một URL khác.

Với các thư viện HTTP request như `axios`, `res` cũng được sử dụng để nhận các phản hồi từ server, và có thể được sử dụng để truy xuất thông tin phản hồi như headers, một phần của body, hoặc các mã lỗi HTTP (`status code`).


Lưu ý rằng biến `res` không phải là một biến có sẵn trong JavaScript, mà chỉ tồn tại trong ngữ cảnh của các framework hoặc thư viện phía server mà ta đang sử dụng.



