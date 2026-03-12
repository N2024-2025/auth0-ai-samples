# C# MCP Server with Auth0 Authentication

This project demonstrates an ASP.NET Core MCP (Model Context Protocol) server with JWT-based authentication using Auth0. The server exposes tools for generating random numbers and managing system state, with authorization policies controlling access based on permission claims. 

The MCP server is built as a self-contained application and does not require the .NET runtime to be installed on the target machine.
However, since it is self-contained, it must be built for each target platform separately.
By default, the template is configured to build for:
* `win-x64`
* `win-arm64`
* `osx-arm64`
* `linux-x64`
* `linux-arm64`
* `linux-musl-x64`

If you require more platforms to be supported, update the list of runtime identifiers in the project's `<RuntimeIdentifiers />` element.

To learn more about this project's implementation, read the blog post [Secure a C# MCP Server with Auth0](https://auth0.com/blog/secure-csharp-mcp-server-with-auth0/).

## Requirements

* .NET 10 SDK (for building and running the project locally)
* An Auth0 account: If you don't already have one, you can [sign up for free](https://a0.to/signup).
* VS Code or Visual Studio with MCP support (Preview)

## Developing locally

To test this MCP server from source code (locally), you can configure your IDE to connect to the server using localhost.

```json
{
  "servers": {
    "AspNetCoreMcpServer": {
      "type": "http",
      "url": "http://localhost:6185"
    }
  }
}
```

Refer to the VS Code or Visual Studio documentation for more information on configuring and using MCP servers:

- [Use MCP servers in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [Use MCP servers in Visual Studio (Preview)](https://learn.microsoft.com/visualstudio/ide/mcp-servers)

## Testing the MCP Server

Once configured, you can test the available tools through Copilot Chat:

* **Random Number Generation**: Ask `Give me 3 random numbers`. Copilot should use the `get_random_number` tool to generate random numbers.

* **Get System State**: Ask `What is the current system state?`. Copilot should use the `get_system_state` tool to retrieve the state. This requires the `tool:getsystemstate` permission.

* **Set System State**: Ask `Set the system state to Running`. Copilot should use the `set_system_state` tool to update the state. This requires the `tool:setsystemstate` permission.

## Known issues

When using VS Code, connecting to `https://localhost:5253` fails.

This is related to using a self-signed developer certificate, even when the certificate is trusted by the system.

Connecting with `http://localhost:6185` succeeds.

See [Cannot connect to MCP server via SSE using trusted developer certificate (microsoft/vscode#248170)](https://github.com/microsoft/vscode/issues/248170) for more information.

## More information

ASP.NET Core MCP servers use the [ModelContextProtocol.AspNetCore](https://www.nuget.org/packages/ModelContextProtocol.AspNetCore) package from the MCP C# SDK. For more information about MCP:

- [Official Documentation](https://modelcontextprotocol.io/)
- [Protocol Specification](https://spec.modelcontextprotocol.io/)
- [MCP C# SDK](https://modelcontextprotocol.github.io/csharp-sdk)
