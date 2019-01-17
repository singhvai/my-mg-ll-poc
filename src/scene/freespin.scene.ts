import { GDK, Local, SceneConfig } from "../config";

export const scene: SceneConfig = {
    id: "FreeSpinScene",
    type: "StandardScene",
    wires: [
        {
            handler: "enableHold",
            event: "MainScene.FreeSpin.Enter"
        },
        {
            handler: "disable",
            event: "FreeSpinScene.Complete.Enter"
        }
    ],
    states: [
        {
            id: "TransitionIn",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "PressToContinue"
            }
        },
        {
            id: "PressToContinue",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "Spin"
            }
        },
        {
            id: "Spin",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "WaitForResult"
            }
        },
        {
            id: "WaitForResult",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "Result"
            }
        },
        {
            id: "Result",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "PresentGameSpecificWins"
            }
        },
        {
            id: "PresentGameSpecificWins",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "CheckToPresentFeature"
            }
        },
        {
            id: "CheckToPresentFeature",
            type: Local.FeatureRetriggerState,
            data: {
                feature: "FreeSpins",
                counterSceneryId: "FreeSpinScene.FeatureTriggerCountScenery",
                maxRetriggerCount: 1,
                resultsSceneryId: "GlobalScene.ResultsScenery"
            },
            transitions: {
                standard: "CheckWinAmount",
                feature: "FeatureBell"
            }
        },
        {
            id: "FeatureBell",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "FeatureRetriggerBell"
            }
        },
        {
            id: "FeatureRetriggerBell",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "PresentFeature"
            }
        },
        {
            id: "PresentFeature",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "CheckWinAmount"
            }
        },
        {
            id: "CheckWinAmount",
            type: GDK.States.BranchState,
            data: {
                evaluatorSceneryId: "MainScene.WinAvailableEvaluator"
            },
            transitions: {
                true: "PresentWins",
                false: "PresentLoss"
            }
        },
        {
            id: "PresentWins",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "DelayBetweenSpins"
            }
        },
        {
            id: "PresentLoss",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "DelayBetweenSpins"
            }
        },
        {
            id: "DelayBetweenSpins",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "CheckComplete"
            }
        },
        {
            id: "CheckComplete",
            type: GDK.States.BranchState,
            data: {
                evaluatorSceneryId: "MainScene.PlaysAvailableEvaluator"
            },
            transitions: {
                true: "Spin",
                false: "TransitionOut"
            }
        },
        {
            id: "TransitionOut",
            type: GDK.States.SimpleDisplayState,
            transitions: {
                standard: "Complete"
            }
        },
        {
            id: "Complete",
            type: GDK.States.TerminalState
        }
    ],
    sceneries: [
        {
            id: "FreeSpinScene.ActivityScenery",
            type: GDK.Scenery.ActivityScenery,
            enabled: false,
            data: {
                expirationSeconds: 25
            }
        },
        {
            id: "FreeSpinScene.FeatureTriggerCountScenery",
            type: GDK.Scenery.CounterScenery,
            data: {
                countThreshold: 2
            }
        }
    ],
    performers: [
        {
            id: "FreeSpinScene.ActivityPerformer",
            type: GDK.Performer.ActivityPerformer,
            data: {
                activitySceneryId: "FreeSpinScene.ActivityScenery"
            },
            wires: [
                {
                    handler: "disableTimer",
                    event: "FreeSpinScene.PressToContinue.Exit"
                },
                {
                    handler: "enableTimer",
                    event: "FreeSpinScene.PressToContinue.Enter"
                }
            ]
        },
        {
            id: "FreeSpinScene.SlotDefinitionUpdatePerformer",
            type: GDK.Performer.SlotDefinitionUpdatePerformer,
            data: {
                slotDefinitionSceneryId: "MainScene.SlotDefinitionScenery",
                updateActions: {
                    insertSymbols: {
                        numberOfSymbols: 1
                    }
                }
            },
            wires: [
                {
                    handler: "updateDefinition",
                    event: "FreeSpinScene.Spin.Enter"
                }
            ]
        },
        {
            id: "FreeSpinScene.SpinReelSetPerformer",
            type: GDK.SpinReelSetPerformer,
            data: {
                betManagerSceneryId: "GlobalScene.BetManagerScenery",
                resultsSceneryId: "GlobalScene.ResultsScenery",
                serviceRequestSceneryId: "GlobalScene.ServiceRequestScenery"
            },
            wires: [
                {
                    handler: "makeSpinReelSetRequest",
                    event: "FreeSpinScene.Spin.Enter"
                }
            ]
        },
        {
            id: "FreeSpinScene.Wait",
            type: GDK.Performer.DelayPerformer,
            data: {
                timerSceneryId: "GlobalScene.TimerScenery",
                duration: 1.0
            },
            wires: [
                {
                    handler: "delay",
                    event: "FreeSpinScene.DelayBetweenSpins.Enter"
                }
            ]
        },
        {
            id: "FreeSpinScene.ReelSpinPerformer",
            type: GDK.Performer.ReelSpinPerformer,
            data: {
                slotSceneryId: "MainScene.SlotScenery",
                resultsSceneryId: "GlobalScene.ResultsScenery"
            },
            wires: [
                {
                    handler: "spin",
                    event: "FreeSpinScene.Spin.Enter"
                },
                {
                     handler: "stop",
                     event: "FreeSpinScene.Result.Enter"
                },
                {
                    handler: "snap",
                    event: "SnapScene.Main.SnapScenery.Snapped"
                }
            ]
        },
        {
            id: "FreeSpinScene.WaitForPlayButtonPerformer",
            type: GDK.Performer.SemaphorePerformer,
            data: {
            },
            wires: [
                {
                    handler: "hold",
                    event: "FreeSpinScene.PressToContinue.Enter"
                },
                {
                    handler: "clear",
                    event: "GlobalScene.LobbyScenery.Snap"
                },
                {
                    handler: "clear",
                    event: "ButtonDeckScene.SpinButton.Clicked"
                },
                {
                    handler: "clear",
                    event: "FreeSpinScene.ActivityScenery.Expired"
                },
                {
                    handler: "clear",
                    event: "MainScene.BevelScenery.Clicked"
                }
            ]
        },
        {
            id: "FreeSpinScene.FreeSpinInstructionsPerformer",
            type: GDK.Performer.FreeSpinInstructionsPerformer,
            data: {
                messageLineSceneryId: "MessageLine_Game_Instructions",
                resultsSceneryId: "GlobalScene.ResultsScenery",
                useNumericFinalGameMessage: true
            },
            wires: [
                {
                    handler: "presentIntroInstructions",
                    event: "FreeSpinScene.PressToContinue.Enter"
                },
                {
                    handler: "presentSpinInstructions",
                    event: "FreeSpinScene.Spin.Enter"
                },
                {
                    handler: "presentRetriggerInstructions",
                    event: "FreeSpinScene.FeatureRetriggerBell.Exit"
                },
                {
                    handler: "presentFeatureCompleteInstructions",
                    event: "FreeSpinScene.CheckWinAmount.Enter"
                }
            ]
        },
        {
            id: "FreeSpinScene.BevelEnablerPerformer",
            type: GDK.Performer.SceneryEnablerPerformer,
            data: {
                sceneryIds: [
                    "MainScene.BevelScenery"
                ]
            },
            wires: [
                {
                    handler: "enableScenery",
                    event: "FreeSpinScene.PressToContinue.Enter"
                },
                {
                    handler: "disableScenery",
                    event: "FreeSpinScene.PressToContinue.Exit"
                }
            ]
        },
        {
            id: "FreeSpinScene.FeatureTriggerCountPerformer",
            type: GDK.Performer.CounterAdjustmentPerformer,
            data: {
                counterSceneryId: "FreeSpinScene.FeatureTriggerCountScenery"
            },
            wires: [
                {
                    handler: "resetCount",
                    event: "FreeSpinScene.Complete.Enter"
                },
                {
                    handler: "incrementCount",
                    event: "FreeSpinScene.PressToContinue.Enter"
                },
                {
                    handler: "incrementCount",
                    event: "FreeSpinScene.PresentFeature.Exit"
                }
            ]
        }
    ]
};
