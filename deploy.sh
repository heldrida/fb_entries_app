#!/usr/bin/env bash

git push production master

ssh root@tlnscompetitions.co.uk "chown tlnscomp:tlnscomp /home/tlnscomp/www/emerge_space -R && chmod 0755 /home/tlnscomp/www/emerge_space -R && exit";