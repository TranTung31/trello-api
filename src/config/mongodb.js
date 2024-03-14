import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// Khởi tạo 1 đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null

// Khởi tạo 1 đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // Lưu ý: serverApi có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó, còn nếu dùng nó
  // chúng ta sẽ chỉ định 1 cái Stable API Version của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy ra Database theo tên và gán ngược lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Function GET_DB() này có nhiệm vụ export ra trelloDatabaseInstance sau khi đã connect thành công tới MongoDB
// để chúng ta có thể sử dụng ở nhiều nơi khác nhau trong code
// Phải đảm bảo chỉ gọi GET_DB() khi đã kết nối tới Database thành công
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}

// Đóng kết nối Database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}