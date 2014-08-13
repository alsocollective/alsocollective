##move this to the parent directory,
## $ python directorytoresize newwidth
## it will then go though each image and compile it...

from PIL import Image
import imghdr
import sys,os
import mimetypes

print sys.argv[1]
root = os.path.dirname(os.path.realpath(__file__))
path = os.path.join(root,sys.argv[1])
array = []
for path, subdirs, files in os.walk(path):
	for name in files:
		fileType = imghdr.what("%s/%s"%(sys.argv[1],name))
		try:
			basewidth = int(sys.argv[2])
			im = Image.open("%s/%s"%(sys.argv[1],name))
			wpercent = (basewidth/float(im.size[0]))
			hsize = int((float(im.size[1])*float(wpercent)))
			im=im.resize((basewidth,hsize), Image.ANTIALIAS)
			if fileType == "jpeg":
				im.save("%s/mobile%s"%(sys.argv[1],name), 'JPEG',quality=90)
			elif fileType == "png":
				im.save("%s/mobile%s"%(sys.argv[1],name), 'PNG',quality=90)
			else:
				im = Image.open("%s/%s"%(sys.argv[1],name))
				im.save("%s/mobile%s"%(sys.argv[1],name))
			#im.save("%s/mobile%s"%(sys.argv[1],name))
		except IOError:
			print "%s not an image"%(name)

# print os.walk(path)[2]

