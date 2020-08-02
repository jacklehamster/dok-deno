const config = {
   "server": {
      "port": 8000
   },
   "webgl": {
      "options": {
         "indexedBuffer": true,
         "context": {
            "antialias": true,
            "preserveDrawingBuffer": false,
            "alpha": false,
            "depth": true,
            "stencil": false,
            "desynchronized": true,
            "premultipliedAlpha": true
         }
      },
      "fragmentShader": "precision mediump float;\n \nvarying vec4 v_color;\n \nvoid main() {\n  gl_FragColor = v_color;\n}\n",
      "vertexShader": "attribute vec3 position;\nattribute vec4 color;\nattribute mat4 matrix;\nuniform mat4 projection;\nuniform mat4 view;\n\nvarying vec4 v_color;\n \nvoid main() {\n  // Multiply the position by the matrix.\n\tgl_Position = projection * view * matrix * vec4(position, 1.);\n\tv_color = color;\n}\n",
      "attributes": {
         "position": {
            "type": "FLOAT"
         },
         "color": {
            "instances": 1,
            "type": "UNSIGNED_BYTE",
            "normalize": true
         },
         "matrix": {
            "instances": 1,
            "type": "FLOAT"
         }
      }
   }
};