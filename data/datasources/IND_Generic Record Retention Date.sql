declare 
    @category varchar(100) = ${DOCUMENT.category},
    @documentType varchar(100) = ${DOCUMENT.documentType},
    @recordType varchar(400) = ${Record Type},
    @createdDate date = ${Ingest Date}

declare @rule varchar(100) = (
                                 select top 1
                                     RetentionDateRule
                                 from
                                     _UW_Retention_Mapping
                                 where
                                     RecordType = @recordType
                                     and Category = @category
                                     and DocumentType = @documentType
                                     and (deleted = 0 or deleted is null)
                             )

/*
Ex. "Created Date + 3 Years", replace "Created Date +", leaves you with “ 3 Years”, replace “Years”, leaves you with “ 3 “, replace Year, leaves you with “ 3 “, trimmed, leaves you with “3”
*/
declare @years varchar(10)
    =       (
                select
                    TRIM(TRIM(REPLACE(REPLACE(REPLACE(@rule, 'Created Date + ', ''), ' Years', ''), ' Year', '')))
            )


if @rule = 'Created Date'
    select
        @createdDate
else if @rule like 'Created Date%'
    select
        dateadd(year, cast(@years as int), @createdDate)
else if @rule = 'End Fiscal Year'
        or @rule = 'End Academic Year'
    select
        case when
            month(@createdDate) < 7 then  
                         cast(cast(year(@createdDate) as varchar) + '-07-01' as date)
            else 
                         dateadd(year, 1, cast(cast(year(@createdDate) as varchar) + '-07-01' as date))
            end
else if @rule = 'End Calendar Year'
    select top 1
         dateadd(year, 1, cast(cast(year(@createdDate) as varchar) + '-01-01' as date))
else --manual trigger
    select
        ''