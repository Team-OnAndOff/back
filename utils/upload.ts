import multer from 'multer'
import httpStatus from 'http-status'
import { ApiError } from './error'

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  dest: '/events',
  preservePath: true,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(
        new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Only images are allowed!',
        ),
      )
    }
  },
})

export { upload }
