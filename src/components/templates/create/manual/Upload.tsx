/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Image, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

type AppProps = {
  selectedFile: File | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const App: React.FC<AppProps> = ({ selectedFile, setSelectedFile }) => {
  const [preview, setPreview] = useState<string | undefined>("")

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setSelectedFile(info.file.originFileObj)
        console.log('selectedFile', selectedFile)
        console.log('preview', preview)
        
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
  }, [selectedFile])


  return (
    <>
      {preview ? (
        <Space size={12}>
          <Image
            preview={false}
            width={400}
            alt=""
            src={preview}
          />
          <DeleteOutlined 
            onClick={() => { setSelectedFile(undefined) }} 
            style={{
              color: 'red',
              fontSize: '30px'
            }}
          />
        </Space>
      ) : (
        <Dragger 
          {...props} 
          style={{ backgroundColor: 'white' }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Upload your image here
          </p>
        </Dragger>)
      }
    </>
    
  )
};

export default App;