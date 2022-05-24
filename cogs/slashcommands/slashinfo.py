import discord
from discord.ext import commands
from discord.commands import slash_command

from private.essentials import BOT_INVITE, INVITE_LINK, BOT_OWNER_ID

class SlashInfoUI(discord.ui.View):
    def __init__(self):
        super().__init__()
        self.value = None
        self.add_item(discord.ui.Button(label = "Invite", url = BOT_INVITE, emoji= "➕"))
        self.add_item(discord.ui.Button(label = "Support", url = INVITE_LINK, emoji= "📩"))

class SlashInfo(commands.Cog):
    def __init__(self, client):
        self.client = client

    @slash_command(description = "Display some information about the Bot.")
    async def info(self, ctx):
        view = SlashInfoUI()
<<<<<<< HEAD
        embed = discord.Embed(title = "Bot Information", color = 0xFFA500, description = "Name: **JazzRadio**\n\n" +
        "Description: **Pure Classic Jazz music to your ears**\n\n" +
        "Coded with: **JavaScript** Switched to ||**Python**||.\n\n" +
=======
        embed = discord.Embed(title = "Bot Information", color = 0xFB401B, description = "Name: **HitRadio**\n\n" +
        "Description: **HitRadio that plays 100% Hits for you.**\n\n" +
        "Coded with: **Python**.\n\n" +
>>>>>>> 48f4f431b2c0339f102197f12d51b2380cc5e9db
        "Host: **EU/France**\n\n\n" +
        f'Made with ❤️ by <@{BOT_OWNER_ID}>.')

        return await ctx.response.send_message(embed = embed, view = view, ephemeral = True)

def setup(client):
    client.add_cog(SlashInfo(client))