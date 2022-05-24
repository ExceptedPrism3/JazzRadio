import discord
from discord.ext import commands
from discord.commands import slash_command

class SlashHelp(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @slash_command(description = "Displays the help menu.")
    async def help(self, ctx):
    
<<<<<<< HEAD
        embed = discord.Embed(title = "Help Commands", color = 0xFFA500)
        embed.add_field(name = "Play", value = "Join your voice channel and plays Jazz.\n`/play`")
        embed.add_field(name = "Resume", value = "Resume playing when stopped.\n`/resume`")
=======
        embed = discord.Embed(title = "Help Commands", color = 0xFB401B)
        embed.add_field(name = "Play", value = "Join your voice channel and plays the Hits.\n`/play`")
        embed.add_field(name = "Resume", value = "Resume playing hits when stopped.\n`/resume`")
>>>>>>> 48f4f431b2c0339f102197f12d51b2380cc5e9db
        embed.add_field(name = "Ping", value = "Check the Bot's Ping.\n`/ping`")
        embed.add_field(name = "Leave", value = "Leave your voice channel.\n`/leave`")
        embed.add_field(name = "Stop", value = "Stop playing.\n`/stop`")
        embed.add_field(name = "Vote", value = "Display Links of the Bot.\n`/vote`")
        embed.add_field(name = "UpTime", value = "Display the Bot's uptime.\n`/uptime`")
        embed.add_field(name = "Volume", value = "Adjust your Bot's Volume.\n`/volume`")

        return await ctx.respond(embed = embed, ephemeral = True)


def setup(bot):
    bot.add_cog(SlashHelp(bot))