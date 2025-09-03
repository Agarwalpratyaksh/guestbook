/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/guestbook.json`.
 */
export type Guestbook = {
  "address": "8tf51wycCRM21mqVBWGvB1tpJ5QVcb8PtTaLuAHyMwib",
  "metadata": {
    "name": "guestbook",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "writeMessage",
      "discriminator": [
        252,
        50,
        173,
        225,
        111,
        116,
        97,
        208
      ],
      "accounts": [
        {
          "name": "messageAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  115,
                  115,
                  97,
                  103,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "messageAccount",
      "discriminator": [
        97,
        144,
        24,
        58,
        225,
        40,
        89,
        223
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "messageTooLong",
      "msg": "Message is too long"
    }
  ],
  "types": [
    {
      "name": "messageAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    }
  ]
};
