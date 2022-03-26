using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Buddies.API.Migrations
{
    public partial class AddBuddyScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFinished",
                table: "Projects",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<float>(
                name: "BuddyScore",
                table: "Profiles",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCount",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ProjectId",
                table: "AspNetUsers",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Projects_ProjectId",
                table: "AspNetUsers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Projects_ProjectId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ProjectId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsFinished",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BuddyScore",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProjectCount",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "AspNetUsers");
        }
    }
}
