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
            "type": "UNSIGNED_BYTE",
            "normalize": true,
            "usage": "STATIC_DRAW"
         },
         "colors": {
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
      "vertexShader": "attribute vec3 position;\nattribute vec2 vertexPosition;\nattribute mat4 colors;\nattribute mat4 matrix;\nattribute float isPerspective;\nattribute float vertexId;\nuniform float time;\nuniform mat4 perspective;\nuniform mat4 ortho;\nuniform mat4 view;\n\nvarying vec4 v_color;\n\nvec4 getCornerValue(mat4 value, vec2 vertexPosition) {\n\treturn mix(\n\t\tmix(value[0], value[1], vertexPosition.x + .5),\n\t\tmix(value[2], value[3], vertexPosition.x + .5),\n\t\tvertexPosition.y + .5);\t\n}\n\nvoid main() {\n\tfloat vIsPerspective = (sin(time / 1000.) + 1.) * .5 * isPerspective;\n\tmat4 projection = vIsPerspective * perspective + (1. - vIsPerspective) * ortho;\n\t// Multiply the position by the matrix.\n\tgl_Position = projection * view * (vec4(position, 0) + matrix * vec4(vertexPosition, 0, 1.));\n\tv_color = getCornerValue(colors, vertexPosition);\n}\n"
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