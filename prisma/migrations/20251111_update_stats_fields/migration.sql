-- AlterTable: Rename stats columns to new naming convention
ALTER TABLE "Profile" RENAME COLUMN "statsYears" TO "statsYearsOfExperience";
ALTER TABLE "Profile" RENAME COLUMN "statsProposals" TO "statsTotalFundingSecured";
ALTER TABLE "Profile" RENAME COLUMN "statsClients" TO "statsCountries";
ALTER TABLE "Profile" RENAME COLUMN "statsSuccessRate" TO "statsWinningRate";

-- Update the values to match new requirements
UPDATE "Profile" SET 
  "statsYearsOfExperience" = '+6',
  "statsTotalFundingSecured" = '$M12+',
  "statsCountries" = '5+',
  "statsWinningRate" = '75%'
WHERE "id" = 'profile';

