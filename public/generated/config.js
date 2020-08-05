const config = {
   "server": {
      "port": 8000
   },
   "webgl": {
      "attributes": {
         "position": {
            "type": "FLOAT",
            "usage": "STATIC_DRAW"
         },
         "isPerspective": {
            "instances": 1,
            "type": "FLOAT",
            "usage": "STATIC_DRAW"
         },
         "color": {
            "instances": 1,
            "type": "UNSIGNED_BYTE",
            "normalize": true,
            "usage": "DYNAMIC_DRAW"
         },
         "matrix": {
            "instances": 1,
            "type": "FLOAT",
            "usage": "DYNAMIC_DRAW"
         }
      },
      "options": {
         "context": {
            "antialias": true,
            "preserveDrawingBuffer": false,
            "alpha": false,
            "depth": true,
            "stencil": false,
            "desynchronized": true,
            "premultipliedAlpha": true
         },
         "maxInstanceCount": 1000,
         "cullFace": "BACK"
      },
      "fragmentShader": "precision mediump float;\n \nvarying vec4 v_color;\n \nvoid main() {\n  gl_FragColor = v_color;\n}\n",
      "vertexShader": "attribute vec3 position;\nattribute vec4 color;\nattribute mat4 matrix;\nattribute float isPerspective;\nuniform mat4 perspective;\nuniform mat4 ortho;\nuniform mat4 view;\n\nvarying vec4 v_color;\n \nvoid main() {\n\tmat4 projection = isPerspective * perspective + (1. - isPerspective) * ortho;\n\t// Multiply the position by the matrix.\n\tgl_Position = projection * view * matrix * vec4(position, 1.);\n\tv_color = color;\n}\n"
   }
};