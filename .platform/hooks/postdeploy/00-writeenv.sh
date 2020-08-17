#!/bin/bash

/opt/elasticbeanstalk/bin/get-config environment | jq -r 'to_entries[] | .key + "=" + .value | @sh' | awk '{ print "export " $0 }' > /var/app/env
