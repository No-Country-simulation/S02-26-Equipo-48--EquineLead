using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_No_Country_E48.Migrations
{
    /// <inheritdoc />
    public partial class RenameInteractionTypeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InteractionTypeEnum",
                table: "LeadInteractions",
                newName: "InteractionType");

            migrationBuilder.AddColumn<DateTime>(
                name: "LeadScoreDate",
                table: "LeadScores",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "InteractionDate",
                table: "LeadInteractions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LeadScoreDate",
                table: "LeadScores");

            migrationBuilder.DropColumn(
                name: "InteractionDate",
                table: "LeadInteractions");

            migrationBuilder.RenameColumn(
                name: "InteractionType",
                table: "LeadInteractions",
                newName: "InteractionTypeEnum");
        }
    }
}
