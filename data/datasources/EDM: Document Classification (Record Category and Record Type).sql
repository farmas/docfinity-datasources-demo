declare
    @category varchar(100) = ${DOCUMENT.category},
    @documentType varchar(100) = ${DOCUMENT.documentType},
    @recordCategory varchar(100) = ${Record Category},
    @recordType varchar(100) = ${Record Type},
    @username varchar(100) = ${username},
    @MDOName varchar(100) = 'Document Classification',
    @allowedValues varchar(500) = '',
    @allowedUser varchar(100) = '',
    @classification varchar(100) = '';

-- Get the value of the Document Classification from the retention mapping table
select @classification = dataClassification
  from _UW_Retention_Mapping
    where category=@category and documentType=@documentType and recordCategory=@recordCategory and recordType=@recordType and (deleted = 0 or deleted is null)

-- Get allowed values based on filter security
select @allowedValues = @allowedValues + sf.value + '|| '
  from SecurityFilters sf
    join DocumentSecurities ds on sf.documentSecurityId=ds.id
    join DocumentTypeGroups dtg on dtg.id=ds.documentTypeGroupId
    join GroupMembers gm on gm.groupId=dtg.groupId
    join Users u on u.id=gm.userId
    join DocumentTypes dt on dt.id=dtg.documentTypeId
    join Categories c on c.id=dt.categoryId
    join MetadataObjects mo on mo.id = sf.MetadataId and mo.[name] = @MDOName
  where u.username=@username and ds.permissionType='UPDATE' and c.name=@category and dt.name=@documentType

-- Get the current username if they have unfiltered UPDATE access to that document type (via a group that is not filtered).
select @allowedUser = u.username
  from users u
    join GroupMembers gm on gm.userId=u.id
    join DocumentTypeGroups dtg on dtg.groupId=gm.groupId
    join DocumentSecurities ds on ds.documentTypeGroupId=dtg.id
    join DocumentTypes dt on dt.id=dtg.documentTypeId
    join Categories c on c.id=dt.categoryId
  where u.username=@username and ds.permissionType='UPDATE' and c.name=@category and dt.name=@documentType and gm.groupId not in(select gm.groupId
    from SecurityFilters sf
      join DocumentSecurities ds on sf.documentSecurityId=ds.id
      join DocumentTypeGroups dtg on dtg.id=ds.documentTypeGroupId
      join GroupMembers gm on gm.groupId=dtg.groupId
      join Users u on u.id=gm.userId
      join DocumentTypes dt on dt.id=dtg.documentTypeId
      join Categories c on c.id=dt.categoryId
      join MetadataObjects mo on mo.id = sf.MetadataId and mo.[name] = @MDOName
    where u.username=@username and ds.permissionType='UPDATE' and c.name=@category and dt.name=@documentType)

if CHARINDEX(@classification + '||', @allowedValues) > 0 or @username = @allowedUser
  select @classification as Value
else 
  select 'Invalid Permission' as Value