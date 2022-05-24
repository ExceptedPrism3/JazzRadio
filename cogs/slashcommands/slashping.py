import discord 
from discord.ext import commands
from discord.commands import slash_command

class SlashPing(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @slash_command(description = "Shows the Bot's ping.")
    async def ping(self, ctx):

<<<<<<< HEAD
        embed = discord.Embed(title = "Ping", description = "**Calculating...**", color = 0xFFA500)

        msg = await ctx.send(embeds = [embed])

        embedPing = discord.Embed(title = "🏓 Pong", description = f'Bot Latency: **{round(self.bot.latency * 1000)}** ms', color = 0xFFA500)
=======
        embed = discord.Embed(title = "Ping", description = "**Calculating...**", color = 0xFB401B)

        msg = await ctx.send(embeds = [embed])

        embedPing = discord.Embed(title = "🏓 Pong", description = f'Bot Latency: **{round(self.bot.latency * 1000)}** ms', color = 0xFB401B)
>>>>>>> 48f4f431b2c0339f102197f12d51b2380cc5e9db

        return await msg.edit(embeds = [embedPing])


def setup(bot):
    bot.add_cog(SlashPing(bot))