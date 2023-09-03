import { cpus } from 'os'
import { ImagePool } from '@squoosh/lib'
import tinify from 'tinify'
import * as process from 'process'
import { Express } from 'express'
const imagePool = new ImagePool(cpus().length)

export async function squooshCompression(fileBuffer: ArrayBuffer): Promise<Uint8Array> {
  const image = imagePool.ingestImage(fileBuffer)
  await image.encode({
    mozjpeg: {
      quality: 90,
    },
  })
  const binary = await image.encodedWith.mozjpeg?.binary
  if (!binary) throw new Error('no binary')
  return binary
}

export async function handleCompression(file: Express.Multer.File): Promise<Uint8Array> {
  let tinified: Uint8Array
  switch (file.mimetype) {
    case 'image/jpeg':
    case 'image/jpg':
      {
        tinified = await squooshCompression(file.buffer)
      }
      break
    case 'image/png':
      {
        const tinifyKey = process.env.TINIFY_KEY
        // if tinify key is set, use tinify to compress
        if (tinifyKey) {
          tinify.key = tinifyKey
          tinified = await tinify.fromBuffer(file.buffer).toBuffer()
        } else {
          tinified = new Uint8Array(file.buffer)
        }
      }
      break
    case 'image/svg+xml':
    case 'image/svg':
      {
        file.mimetype = 'image/svg+xml'
        tinified = new Uint8Array(file.buffer)
      }
      break
    default: {
      throw new Error('unsupported file type')
    }
  }
  return tinified
}
