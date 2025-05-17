/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/agent_task.json`.
 */
export type AgentTask = {
  "address": "4UrP3GhXtV7o35usMeSHaacE44AnmAnjuE1xRfuVjXWx",
  "metadata": {
    "name": "agentTask",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimTask",
      "discriminator": [
        49,
        222,
        219,
        238,
        155,
        68,
        221,
        136
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "task",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107
                ]
              },
              {
                "kind": "arg",
                "path": "params.task_id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "claimTaskParams"
            }
          }
        }
      ]
    },
    {
      "name": "completeTask",
      "discriminator": [
        109,
        167,
        192,
        41,
        129,
        108,
        220,
        196
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "task",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107
                ]
              },
              {
                "kind": "arg",
                "path": "params.task_id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "completeTaskParams"
            }
          }
        }
      ]
    },
    {
      "name": "confirmTask",
      "discriminator": [
        168,
        184,
        67,
        118,
        227,
        95,
        112,
        166
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "task",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  97,
                  115,
                  107
                ]
              },
              {
                "kind": "arg",
                "path": "params.task_id"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "confirmTaskParams"
            }
          }
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  105,
                  116,
                  105,
                  97,
                  108,
                  105,
                  122,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initializeParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "task",
      "discriminator": [
        79,
        34,
        229,
        55,
        88,
        90,
        55,
        84
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notTaskManager",
      "msg": "Not Task Manager"
    },
    {
      "code": 6001,
      "name": "notRewarder",
      "msg": "Not Rewarder"
    }
  ],
  "types": [
    {
      "name": "claimTaskParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "taskId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "completeTaskParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "taskId",
            "type": "u64"
          },
          {
            "name": "taskName",
            "type": "string"
          },
          {
            "name": "taskDescription",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "taskManager",
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "confirmTaskParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "taskId",
            "type": "u64"
          },
          {
            "name": "taskStatus",
            "type": {
              "defined": {
                "name": "taskStatus"
              }
            }
          },
          {
            "name": "rewarder",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "taskManager",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "delegate",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "task",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "taskId",
            "type": "u64"
          },
          {
            "name": "taskStatus",
            "type": {
              "defined": {
                "name": "taskStatus"
              }
            }
          },
          {
            "name": "reward",
            "type": "u64"
          },
          {
            "name": "rewarder",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "taskName",
            "type": "string"
          },
          {
            "name": "taskDescription",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "taskStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "completed"
          },
          {
            "name": "failed"
          },
          {
            "name": "confirmed"
          },
          {
            "name": "claimed"
          }
        ]
      }
    }
  ]
};
