import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { handler as authOptions } from '@/app/api/auth/[...nextauth]/route';

// Cloudinary auto-configures using CLOUDINARY_URL in the environment
// No need to explicitly call cloudinary.config() if CLOUDINARY_URL is present.

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file } = await req.json();

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Cloudinary
    // file is expected to be a base64 DataURI string (e.g., data:image/jpeg;base64,...)
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'skillogram',
      resource_type: 'auto',
    });

    return Response.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return Response.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
