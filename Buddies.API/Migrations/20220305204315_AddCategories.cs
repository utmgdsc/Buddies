using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Buddies.API.Migrations
{
    public partial class AddCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectUser",
                columns: table => new
                {
                    InvitedToProjectId = table.Column<int>(type: "integer", nullable: false),
                    InvitedUsersId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUser", x => new { x.InvitedToProjectId, x.InvitedUsersId });
                    table.ForeignKey(
                        name: "FK_ProjectUser_AspNetUsers_InvitedUsersId",
                        column: x => x.InvitedUsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectUser_Projects_InvitedToProjectId",
                        column: x => x.InvitedToProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectUser1",
                columns: table => new
                {
                    MembersId = table.Column<int>(type: "integer", nullable: false),
                    ProjectsProjectId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUser1", x => new { x.MembersId, x.ProjectsProjectId });
                    table.ForeignKey(
                        name: "FK_ProjectUser1_AspNetUsers_MembersId",
                        column: x => x.MembersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectUser1_Projects_ProjectsProjectId",
                        column: x => x.ProjectsProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Accounting" },
                    { 2, "Anthropology" },
                    { 3, "Statistics" },
                    { 4, "Mathematics" },
                    { 5, "Religion" },
                    { 6, "Architect" },
                    { 7, "Art" },
                    { 8, "Computer Science" },
                    { 9, "Computer Engineering" },
                    { 10, "Physics" },
                    { 11, "Chemistry" },
                    { 12, "Biology" },
                    { 13, "Language" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectUser_InvitedUsersId",
                table: "ProjectUser",
                column: "InvitedUsersId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectUser1_ProjectsProjectId",
                table: "ProjectUser1",
                column: "ProjectsProjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "ProjectUser");

            migrationBuilder.DropTable(
                name: "ProjectUser1");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
