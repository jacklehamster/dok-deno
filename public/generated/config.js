const config = {
   "server": {
      "port": 8000
   },
   "webgl": {
      "attributes": {
         "vertexPosition": {
            "type": "FLOAT",
            "usage": "STATIC_DRAW"
         },
         "vertexId": {
            "type": "UNSIGNED_BYTE",
            "usage": "STATIC_DRAW"
         },
         "position": {
            "instances": 1,
            "type": "FLOAT",
            "usage": "DYNAMIC_DRAW"
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
         "cullFace": "BACK",
         "blend": [
            "SRC_ALPHA",
            "ONE_MINUS_SRC_ALPHA"
         ]
      },
      "fragmentShader": "precision mediump float;\n \nvarying vec4 v_color;\n \nvoid main() {\n  gl_FragColor = v_color;\n}\n",
      "vertexShader": "attribute vec3 position;\nattribute vec3 vertexPosition;\nattribute vec4 color;\nattribute mat4 matrix;\nattribute float isPerspective;\nattribute float vertexId;\nuniform float time;\nuniform mat4 perspective;\nuniform mat4 ortho;\nuniform mat4 view;\n\nvarying vec4 v_color;\n \n\n\nvoid main() {\n\tfloat vIsPerspective = (sin(time / 1000.) + 1.) * .5 * isPerspective;\n\tmat4 projection = vIsPerspective * perspective + (1. - vIsPerspective) * ortho;\n\t// Multiply the position by the matrix.\n\tgl_Position = projection * view * (vec4(position, 0) + matrix * vec4(vertexPosition, 1.));\n\tv_color = vec4(color.xyz, vertexId * .2 + .2);\n}\n"
   },
   "viewport": {
      "size": [
         512,
         512
      ],
      "resolution": [
         1024,
         1024
      ]
   }
};