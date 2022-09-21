declare
    @parentDatasource varchar(100) = 'AEDS: SCCs',
    @childDatasource varchar(100) = 'AEDS: Divisions',
    @parentValue varchar(100) = ${SCC};

select
    value
from
    _UW_Dropdown_Source_Table
where
    parentDatasource = @parentDatasource and
    datasource = @childDatasource and
    parentValue = @parentValue
order by
    ISNULL(sortOrder, 0),
    value desc