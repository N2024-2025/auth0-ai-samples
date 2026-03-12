using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Server;

internal enum SystemState
{
    Ready,
    Waiting,
    Running,
    Stopped
}

/// <summary>
/// MCP tools that expose operations for managing the state of a fictitious system.
/// </summary>
internal class SystemTools
{
    private static readonly SystemState[] AllStates = Enum.GetValues<SystemState>();
    private static SystemState? _currentState;

    [McpServerTool]
    [Description("Returns the current state of the fictitious system. Possible states are: Ready, Waiting, Running, Stopped.")]
    [Authorize(Policy = "GetSystemStatePolicy")]
    public string GetSystemState()
    {
        _currentState ??= AllStates[Random.Shared.Next(AllStates.Length)];
        return _currentState.ToString()!;
    }

    [McpServerTool]
    [Description("Sets the current state of the fictitious system. Valid states are: Ready, Waiting, Running, Stopped.")]
    [Authorize(Policy = "SetSystemStatePolicy")]
    public string SetSystemState(
        [Description("The new state to set. Must be one of: Ready, Waiting, Running, Stopped.")] SystemState state)
    {
        _currentState = state;
        return $"System state set to '{_currentState}'.";
    }
}
