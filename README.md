# S3Drive

## API

- /auth

  - POST

    - Request

      - ```json
        {
          "id": "STRING",
          "pw": "SHA256(STRING)"
        }
        ```
        둘다 공백시 Cookie 기반으로 갱신된 값 cookie set

    - Response

      - ```json
        {
          "id": "STRING"
        }
        ```

      - error

        - 500
          - Internal Server error
        - 401
          - Invalid user

- /dir

  - GET

    - ```json
      [
        {
          "Name": "BUCKET_NAME",
          "CreationDate": "DATEFORMAT"
        }
      ]
      ```

- /dir/{BUCKET_NAME}/{OBJECT_KEY}

  - GET
    - filestream
    - Error
      - 500
        - Internal server error
      - 404
        - If the file does not exist.
      - 401
        - If the cookie does not contain a valid jwt token.
  - PUT
    - filestream
  - Error
    - 500
      - Internal server error
    - 401
      - If the cookie does not contain a valid jwt token.

- /info/{BUCKET_NAME}/{OBJECT_KEY}

  - GET
    - infomation of Bucket or Object or Directory.

- /share/{TOKEN}

  - GET
    -
