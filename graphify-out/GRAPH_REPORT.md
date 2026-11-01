# Graph Report - giaphadongho  (2026-11-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1323 nodes · 3780 edges · 69 communities (56 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d0578aa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68

## God Nodes (most connected - your core abstractions)
1. `next` - 130 edges
2. `getSupabase` - 126 edges
3. `lucide-react` - 94 edges
4. `react` - 73 edges
5. `getUser` - 61 edges
6. `getProfile` - 58 edges
7. `Person` - 48 edges
8. `getFamilyContextBySlug` - 41 edges
9. `getFamilyContextById` - 39 edges
10. `useDashboard()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `LineageManagerProps` --references--> `Person`  [EXTRACTED]
  components/LineageManager.tsx → types/index.ts
- `PersonNodeData` --references--> `Person`  [EXTRACTED]
  components/RelationshipCanvasEditor.tsx → types/index.ts
- `RelationshipManagerProps` --references--> `Person`  [EXTRACTED]
  components/RelationshipManager.tsx → types/index.ts
- `FamilyNodeCardProps` --references--> `Person`  [EXTRACTED]
  components/FamilyNodeCard.tsx → types/index.ts
- `MemberFormProps` --references--> `Person`  [EXTRACTED]
  components/MemberForm.tsx → types/index.ts

## Import Cycles
- 2-file cycle: `components/DashboardContext.tsx -> components/ViewToggle.tsx -> components/DashboardContext.tsx`

## Communities (69 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (80): createOrUpdatePostAction, deleteBlogPost(), deleteFamilyBlogPost(), deleteScopedBlogPost(), ensureBlogAccess(), getSafeCount(), getStoragePrefix(), getText() (+72 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (75): applyLineageSyncAction(), applyTreeLineage(), computeTreeLineage(), createOrUpdateRelationshipAction(), deleteRelationshipAction(), fetchChildrenMarriagesAndGrandchildrenAction(), fetchRelationshipsDataAction(), getCanvasDataAction() (+67 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (51): deleteCustomEventAction(), readNullableNumber(), readNullableString(), readString(), revalidateEventSurfaces(), saveCustomEventAction(), FamilyAboutPage(), PageProps (+43 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (46): adminLoginAction(), AuthActionResult, explainAuthError(), getSafeAdminRedirect(), loginAction(), signInWithGoogleAction(), signOutAction(), signUpAction() (+38 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (53): applyExcelImportAction(), getFallbackImportRefs(), getImportContext(), importErrorMessage(), loadCurrentTree(), parseRows(), previewExcelImportAction(), readString() (+45 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (8): root, root, root, root, root, root, root, root

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): changeOwnPassword(), ChangePasswordForm(), ChangePasswordFormProps, AdminChangePasswordPage(), metadata, LegacyDataPage(), LegacyEventsPage(), LegacyKinshipPage() (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (33): getMemberDetailAction(), deleteAvatarAction(), AdminContactRow, FamilyAdminsPage(), metadata, PageProps, FamilyBlogPage(), PageProps (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (20): BaseToolbar(), BaseToolbarProps, ExportButton(), fadeIn, LandingHeroProps, staggerContainer, MemberDetailContent(), MemberDetailContentProps (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (35): EmptyTreeView(), FamilyTree(), genderText(), generationText(), IntegratedTreePlane(), MemberFilter, MiniMapState, MiniRelationPersonCard() (+27 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (29): BubbleMapTree(), BubbleMapTreeProps, GraphLink, GraphNode, DashboardViewsProps, AVATAR_VERSION, FamilyStatsProps, FamilyTreeProps (+21 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (23): addSelfToFamilyTreeAction(), cancelGenealogyRequestAction(), ClaimActionResult, claimExistingPersonAction(), GenealogyRequest, reviewGenealogyRequestAction(), syncMemberProfileWithTreeAction(), unlinkSelfAction() (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (23): approveFamilyCreationAction(), cancelFamilyCreationAction(), FamilyCreationRequest, FamilyCreationRequestAdminRow, getText(), getUserActiveFamilyCreationRequest(), rejectFamilyCreationAction(), requestFamilyCreationAction() (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (19): DefaultAvatar(), FamilyNodeCard(), FamilyNodeCardProps, FemaleIcon(), MaleIcon(), getGenderStyle(), KINSHIP_TERMS, PersonNode (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (24): BackupPayload, CustomEventExport, ensureCanEdit(), exportData(), importData(), ImportPayload, PersonDetailsPrivateExport, PersonExport (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (21): getAdminFamilyCreationRequests(), AdminBlogPage(), metadata, PageProps, AdminFamiliesDashboardPage(), assertSuperAdmin(), metadata, normalizeFamilies() (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (3): Lunar, lunar-javascript, Solar

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (24): devDependencies, tailwindcss@^4.2.2, @tailwindcss/postcss@^4.2.2, tsx@^4.22.4, @types/d3@^7.4.3, @types/node@^25.5.0, @types/papaparse@^5.5.2, @types/react@^19.2.14 (+16 more)

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (22): deleteFamilyAction(), ensureSystemAdmin(), getSupabaseErrorMessage(), replaceFamilyAdminAction(), setUserFamilyMembership(), AdminFamilyMembershipPanel(), AdminFamilyMembershipPanelProps, AdminFamilyMembershipRow (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (17): AboutPage(), metadata, getCurrentUserAction(), dynamic, metadata, NewsPage(), NewsPageProps, NewsPost (+9 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (21): dependencies, @aws-sdk/client-s3@^3.1157.0, d3@^7.9.0, dompurify@^3.4.11, framer-motion@^12.38.0, html-to-image@^1.11.13, jspdf@^4.2.1, lucide-react@^1.7.0 (+13 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (19): SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD, SUPABASE_PROJECT_ID, jobs, migrate, env, runs-on, steps (+11 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (16): appendStatus(), getText(), requestJoinFamilyAction(), reviewJoinRequestAction(), safeDashboardReturnTo(), DirectoryRow, FamilyDirectoryDetailPage(), getFamilyBySlug() (+8 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (16): adminCreateUser(), changeAnyUserPassword(), changeUserRole(), deleteUser(), familyRoles, membershipStatuses, readTrimmed(), toggleUserStatus() (+8 more)

### Community 24 - "Community 24"
Cohesion: 0.16
Nodes (13): dynamic, formatNewsDate(), getLatestSystemNews, metadata, LandingAbout(), LandingHero(), fallbackNews, LandingLatestNews() (+5 more)

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (13): AvatarToggle(), DashboardState, useDashboard(), DashboardMemberList(), BubbleMapTree, DashboardViews(), FamilyTree, MindmapTree (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.26
Nodes (13): ALLOWED_MIME_TYPES, deleteMediaAction(), listMediaAction(), StorageUploadResult, uploadAvatarAction(), AdminMediaPage(), metadata, formatBytes() (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.20
Nodes (15): AdminFamilyCreateFormProps, ActionResult, AdminFamilyDashboard(), AdminFamilyDashboardProps, getActiveAdmins(), getActiveMemberCount(), getPersonCount(), membershipLabel() (+7 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (16): scripts, build, db:backup, db:link, db:migration:list, db:migration:new, db:pull, db:push (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.21
Nodes (10): cleanText(), recordSiteVisit(), beVietnamPro, metadata, RootLayout(), studioBrush, viewport, PwaRegister() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (12): getMemorialLetterAction(), MemorialLetterResult, MemorialLetterCard(), MemorialLetterCardProps, MemorialLetterModal(), MemorialLetterModalProps, ContentStatus, FamilyContext (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.21
Nodes (13): dynamic, FamilyBlogDetailPage(), formatDate(), generateMetadata(), getReadingMinutes(), hasHtmlContent(), injectImgInlineStyles(), PageProps (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.27
Nodes (7): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), LoadingComponent()

### Community 34 - "Community 34"
Cohesion: 0.23
Nodes (11): backupStorageFiles(), traverseFolder(), escapeSqlValue(), fetchAllRows(), fetchAuthUsers(), generateCompleteRestoreSql(), generateTableSql(), getAuthCredentials() (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.23
Nodes (12): AnchoredQuickAddTarget, childRelationshipOptions, getNextBirthOrder(), getOppositeGender(), getSpousesForPerson(), QuickAddRelation, QuickAddTarget, StandaloneQuickAddTarget (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.23
Nodes (12): ANCESTORS, compareSeniority(), computeKinship(), DESCENDANTS, findBloodKinship(), getAncestryData(), getDirectAncestorTerm(), getDirectDescendantTerm() (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.21
Nodes (11): AdminFamilySummary, AdminIndexPage(), formatDate(), metadata, normalizeAdminFamilies(), RecentPost, statCard(), VisitRow (+3 more)

### Community 38 - "Community 38"
Cohesion: 0.27
Nodes (11): BlogDetailPage(), dynamic, formatDate(), formatShortDate(), generateMetadata(), getReadingMinutes(), hasHtmlContent(), injectImgInlineStyles() (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.21
Nodes (10): getCoverImage(), getPostYear(), HomeBlogCarousel(), LandingBlogPost, smokeStyles, formatDate(), NewsFeed(), NewsFeedProps (+2 more)

### Community 40 - "Community 40"
Cohesion: 0.17
Nodes (11): background_color, categories, description, display, icons, name, orientation, scope (+3 more)

### Community 41 - "Community 41"
Cohesion: 0.36
Nodes (7): LifeEventsResult, SingleLifeEventResult, PersonLifeEventModal(), PersonLifeEventModalProps, PersonLifeTimeline(), PersonLifeTimelineProps, PersonLifeEvent

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (6): jszip@^3.10.1, papaparse@^5.5.3, jszip, papaparse, CustomEventRow, PersonDetailsPrivateRow

### Community 43 - "Community 43"
Cohesion: 0.17
Nodes (3): root, root, root

### Community 44 - "Community 44"
Cohesion: 0.36
Nodes (6): FamilyWorkspaceLayout(), FamilyWorkspaceLayoutProps, getCurrentLabel(), sectionMeta, WorkspaceBreadcrumb(), WorkspaceBreadcrumbProps

### Community 45 - "Community 45"
Cohesion: 0.43
Nodes (5): getPersonLifeEventsAction(), FamilyMemberDetailPage(), PageProps, DeleteMemberButton(), DeleteMemberButtonProps

### Community 46 - "Community 46"
Cohesion: 0.52
Nodes (6): backupDir, buildAuthUsersInserts(), buildTableInserts(), escapeSqlValue(), generateCompleteRestore(), readJson()

### Community 47 - "Community 47"
Cohesion: 0.47
Nodes (4): GET(), dynamic, sitemap(), getPublicSupabase()

### Community 49 - "Community 49"
Cohesion: 0.40
Nodes (4): safeStubClient, UserContext, UserState, Profile

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9.39.4, eslint-config-next@16.2.9, eslint, eslint-config-next

### Community 51 - "Community 51"
Cohesion: 0.53
Nodes (4): sharp@^0.34.5, sharp, optimizeAvatarImage(), optimizeBlogImage()

### Community 52 - "Community 52"
Cohesion: 0.50
Nodes (3): ALIAS_MAP, applyCanh1Data(), fetchFromSupabase()

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (3): ALIAS_MAP, applyCanh2Data(), fetchFromSupabase()

### Community 54 - "Community 54"
Cohesion: 0.60
Nodes (4): backupDir, loginAdmin(), readJson(), restoreDiepDungAndBlogs()

### Community 55 - "Community 55"
Cohesion: 0.60
Nodes (4): backupDir, loginAdmin(), readJson(), runRestore()

### Community 56 - "Community 56"
Cohesion: 0.67
Nodes (3): HeaderAuthUser, LandingHeaderProps, navItems

## Knowledge Gaps
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 6` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 7`, `Community 8`, `Community 9`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 27`, `Community 28`, `Community 30`, `Community 32`, `Community 35`, `Community 37`, `Community 38`, `Community 39`, `Community 44`, `Community 45`, `Community 47`, `Community 48`, `Community 56`, `Community 62`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05482456140350877 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Community 8` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 15`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 27`, `Community 28`, `Community 31`, `Community 32`, `Community 33`, `Community 35`, `Community 37`, `Community 38`, `Community 39`, `Community 41`, `Community 44`, `Community 45`, `Community 48`, `Community 56`, `Community 57`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05651176133103844 - nodes in this community are weakly interconnected._
- **Why does `getSupabase` connect `Community 7` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 11`, `Community 12`, `Community 14`, `Community 15`, `Community 18`, `Community 19`, `Community 22`, `Community 23`, `Community 27`, `Community 30`, `Community 31`, `Community 32`, `Community 37`, `Community 38`, `Community 45`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06768905341089371 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06502732240437159 - nodes in this community are weakly interconnected._